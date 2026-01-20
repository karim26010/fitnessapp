from django.urls import path
from .views import FitnessSurveyView, ProfileView, UpdateProfileView

urlpatterns = [
    path('survey/', FitnessSurveyView.as_view(), name='fitness-survey'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='profile-update'),
]
