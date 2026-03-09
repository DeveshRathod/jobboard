FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./

# Install dependencies without cache
RUN npm ci --no-cache

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller image for the runtime
FROM nginx:alpine AS runtime

# Create a non-root user and group, set ownership of the app directory
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /usr/share/nginx/html \
    && mkdir -p /etc/nginx/conf.d \
    && mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /run \
    && mkdir -p /var/log/nginx \
    && chown -R appuser:appgroup /usr/share/nginx/html /etc/nginx/conf.d /var/cache/nginx /run /var/log/nginx

# Copy template configuration and entrypoint script
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Copy the built application from the build stage to the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Switch to the non-root user
USER appuser

# Expose port 80
EXPOSE ${APP_PORT:-80}

# Set the entrypoint to the script that will generate the nginx configuration and start nginx
ENTRYPOINT ["/entrypoint.sh"]


