from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .health import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('', include('django_prometheus.urls')),   # /metrics
    path('api/health', health_check),              # /api/health
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
