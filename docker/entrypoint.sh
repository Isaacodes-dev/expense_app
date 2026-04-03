#!/bin/sh
set -e

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
