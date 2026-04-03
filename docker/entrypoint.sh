#!/bin/sh
set -e

# Copy Vite-built assets into the bind-mounted public/ directory.
# The Dockerfile stores them in /var/www/vite-build/ because the
# bind mount overwrites public/ at runtime.
if [ -d /var/www/vite-build ]; then
    echo "Copying Vite assets to public/build/..."
    cp -r /var/www/vite-build/ /var/www/html/public/build/
fi

# Only run migrations and caching for the main app container (php-fpm).
# Queue workers and other commands skip this block.
if [ "$1" = "php-fpm" ]; then
    echo "Caching configuration..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    echo "Running migrations..."
    php artisan migrate --force

    echo "Application ready."
fi

exec "$@"
