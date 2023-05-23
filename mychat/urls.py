from django.contrib import admin
from django.urls import path, include

# Application definition
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('base.urls'))
]
