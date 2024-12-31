from django.urls import path, include
from . import views

test_patterns = [
    path('index/', views.index, name='django_daraja_index'),
    path('oauth/success', views.oauth_success, name='test_oauth_success'),
    path('stk-push/success', views.stk_push_success, name='test_stk_push_success'),
]

urlpatterns = [
    path('', views.index, name='index'),
    path('tests/', include(test_patterns)),
]
