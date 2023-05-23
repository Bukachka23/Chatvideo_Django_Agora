from django.contrib import admin
from .models import RoomMember


# Provides the admin interface for RoomMember
admin.site.register(RoomMember)
