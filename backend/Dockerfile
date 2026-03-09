FROM python:3.10-slim

# Set environment variables
WORKDIR /app

# Environment variables for Django settings
ENV API_PORT=8000

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Create a non-root user and set permissions
RUN useradd -m backend-user \
    && chmod +x entrypoint.sh \
    && chown -R backend-user:backend-user /app

# Switch to the non-root user
USER backend-user

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["sh", "-c", "./entrypoint.sh"]