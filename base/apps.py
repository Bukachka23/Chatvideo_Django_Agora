from django.apps import AppConfig

# This class represents the base configuration of the application
class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'
