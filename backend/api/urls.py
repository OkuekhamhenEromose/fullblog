from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user', include('user.urls')),
    path('api/core', include('core.urls')),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
