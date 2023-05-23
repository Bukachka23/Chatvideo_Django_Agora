import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mychat.settings')

# The `get_asgi_application` function returns the ASGI application for the Django project.
application = get_wsgi_application()
