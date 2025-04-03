#!/bin/bash

# Define the Nginx config file path
NGINX_CONF="/etc/nginx/nginx.conf"
BACKUP_CONF="/etc/nginx/nginx.conf.bak"

# Define the new limit value
NEW_LIMIT="1024M"

# Check if Nginx is installed
if ! which nginx > /dev/null 2>&1; then
    echo "❌ Error: Nginx is not installed!"
    exit 1
fi

# Create a backup of the current configuration
if [ ! -f "$BACKUP_CONF" ]; then
    cp "$NGINX_CONF" "$BACKUP_CONF"
    echo "✅ Backup created at $BACKUP_CONF"
fi

# Check if client_max_body_size is already set
if grep -q "client_max_body_size" "$NGINX_CONF"; then
    # Update existing value
    sed -i "s/client_max_body_size .*/client_max_body_size $NEW_LIMIT;/" "$NGINX_CONF"
    echo "🔄 Updated client_max_body_size to $NEW_LIMIT"
else
    # Add the setting inside the 'http' block if missing
    sed -i "/http {/a \    client_max_body_size $NEW_LIMIT;" "$NGINX_CONF"
    echo "➕ Added client_max_body_size $NEW_LIMIT in the http block"
fi

# Test the Nginx configuration
if ! nginx -t; then
    echo "❌ Error: Nginx configuration test failed! Reverting changes..."
    cp "$BACKUP_CONF" "$NGINX_CONF"
    exit 1
fi

# Reload Nginx to apply changes
systemctl reload nginx

if [ $? -eq 0 ]; then
    echo "✅ Nginx reloaded successfully with client_max_body_size set to $NEW_LIMIT"
else
    echo "❌ Error: Failed to reload Nginx. Restoring previous config..."
    cp "$BACKUP_CONF" "$NGINX_CONF"
    systemctl reload nginx
fi
