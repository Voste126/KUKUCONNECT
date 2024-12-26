from django.urls import path
# from .views import ChatbotAPIView
from .views import ChatbotResponseView

urlpatterns = [
#     path('chatbot/', ChatbotAPIView.as_view(), name='chatbot-response'),
    path('chatbot/', ChatbotResponseView.as_view(), name='chatbot-response'),
]
