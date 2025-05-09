# Use the official Python image
FROM python:3.12

# Set the working directory
WORKDIR /app

# Copy the requirements file first (to leverage Docker caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application AFTER installing dependencies
COPY . .

# Ensure static files directory exists
RUN mkdir -p /app/staticfiles && chmod 755 /app/staticfiles

# Collect static files inside the container
RUN python manage.py collectstatic --noinput

# Expose the port Django runs on
EXPOSE 8000

# Run migrations manually in order to avoid circular migration issues
CMD ["sh", "-c", "python manage.py makemigrations --noinput && python manage.py migrate && gunicorn --bind 0.0.0.0:8000 backend.wsgi:application"]
