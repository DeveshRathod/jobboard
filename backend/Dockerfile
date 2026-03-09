FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .

# Install dependencies without cache
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create a non-root user,set ownership of the app directory and switch to that user
RUN useradd -m backend-user
RUN chown -R backend-user:backend-user /app
USER backend-user

# PORT for the API
ENV API_PORT=8000

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD [ "sh", "-c" , "python manage.py runserver 0.0.0.0:$API_PORT" ]
