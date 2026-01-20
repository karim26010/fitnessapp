from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ForgotPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='api_register'),
    path('login/', LoginView.as_view(), name='api_login'),
    path('logout/', LogoutView.as_view(), name='api_logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='api_forgot_password'),
]