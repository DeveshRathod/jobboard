#!/bin/sh

echo "Running migrations..."
python manage.py makemigrations accounts
python manage.py makemigrations jobs 
python manage.py migrate --noinput

echo "Starting server..."
exec gunicorn jobboard.wsgi:application --bind 0.0.0.0:$API_PORT --workers 2