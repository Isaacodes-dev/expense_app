# ============================================================
# Stage 1: Build frontend assets
# Uses Node to run Vite, producing hashed static files
# in public/build/ that are copied into the PHP image later.
# ============================================================
FROM node:22-alpine AS node-builder

WORKDIR /build

# Copy manifests first so npm ci is layer-cached
# unless dependencies actually change.
COPY package.json package-lock.json ./
RUN npm ci

# Copy only what Vite needs to build — not the full repo.
COPY vite.config.ts tsconfig.json ./
COPY resources/ resources/

# Vite inlines these at compile time. Override with:
#   docker build --build-arg VITE_APP_NAME="My App" .
ARG VITE_APP_NAME="Finance App"
ARG VITE_LOCALE=en-ZM
ARG VITE_CURRENCY=ZMW

# Output: /build/public/build/
RUN npm run build

# ============================================================
# Stage 2: PHP-FPM production image
# Serves the Laravel API. Nginx sits in front and forwards
# PHP requests here via FastCGI on port 9000.
# ============================================================
FROM php:8.4-fpm-alpine AS php

# Install system libraries required by PHP extensions,
# then install the extensions themselves.
RUN apk add --no-cache \
        postgresql-dev \
        libzip-dev \
        libxml2-dev \
        curl-dev \
        oniguruma-dev \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pgsql \
        bcmath \
        mbstring \
        xml \
        zip \
        curl \
        opcache \
    && rm -rf /var/cache/apk/*

# OPcache production tuning.
# validate_timestamps=0 means PHP never checks if files changed on disk —
# safe for production (immutable image), but must be overridden in dev.
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=16'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.validate_timestamps=0'; \
    echo 'opcache.enable_cli=1'; \
} > /usr/local/etc/php/conf.d/opcache.ini

# PHP-FPM pool tuning — adjust max_children based on available memory.
RUN { \
    echo '[www]'; \
    echo 'pm = dynamic'; \
    echo 'pm.max_children = 20'; \
    echo 'pm.start_servers = 4'; \
    echo 'pm.min_spare_servers = 2'; \
    echo 'pm.max_spare_servers = 6'; \
} > /usr/local/etc/php-fpm.d/zz-tuning.conf

# Optional: Xdebug for development.
# Not included by default — enable with: --build-arg INSTALL_XDEBUG=true
ARG INSTALL_XDEBUG=false
RUN if [ "$INSTALL_XDEBUG" = "true" ]; then \
    apk add --no-cache $PHPIZE_DEPS linux-headers \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && { \
        echo 'xdebug.mode=debug'; \
        echo 'xdebug.client_host=host.docker.internal'; \
        echo 'xdebug.client_port=9003'; \
        echo 'xdebug.start_with_request=trigger'; \
    } > /usr/local/etc/php/conf.d/xdebug.ini; \
fi

# Grab Composer binary from its official image.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy lock file first so composer install is layer-cached.
# --no-dev: skip dev dependencies (phpunit, faker, etc.)
# --no-scripts: defer post-install scripts until full codebase is present.
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader

# Now copy the full application code.
COPY . .

# Re-generate the optimized autoloader with the full codebase.
RUN composer dump-autoload --optimize

# Pull the compiled Vite assets from stage 1.
COPY --from=node-builder /build/public/build/ public/build/

# Ensure Laravel's writable directories exist with correct ownership.
RUN mkdir -p \
        storage/logs \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Entrypoint runs migrations + config caching on container start.
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Run as non-root for security.
USER www-data

EXPOSE 9000

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
