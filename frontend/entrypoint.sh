#!/bin/sh

# Replace BACKEND_HOST placeholder with env var
envsubst '$APP_PORT $BACKEND_HOST' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Optional: frontend runtime config
cat <<EOF > /usr/share/nginx/html/config.js
window.runtimeConfig = {
  VITE_API_BASE: "$VITE_API_BASE"
};
EOF

nginx -g "daemon off;"