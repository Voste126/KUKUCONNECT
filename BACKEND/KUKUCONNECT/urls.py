from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="KukuConnect API",
        default_version='v1',
        description="API documentation for Farmers and Buyers in KukuConnect",
        terms_of_service="https://www.kukuconnect.com/terms/",
        contact=openapi.Contact(email="support@kukuconnect.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),  # Your user app
    path('api/profiles/', include('profiles.urls')),  # Your profiles app
    path('api/products/', include('products.urls')),  # Your products app
    path('api/payments/', include('payments.urls')),  # Your payments app
    path('api/', include('chatbot.urls')),  # Your chatbot app
    # Swagger URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

