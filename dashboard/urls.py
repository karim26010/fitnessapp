from django.urls import path
from .views import (
    dashboardView,
    LogWaterView,
    LogSleepView,
    LogNutritionView,
    LogWeightView,
)

urlpatterns = [
    path("dashboard/", dashboardView.as_view(), name="dashboard"),
    path("log/water/", LogWaterView.as_view(), name="log-water"),
    path("log/sleep/", LogSleepView.as_view(), name="log-sleep"),
    path("log/nutrition/", LogNutritionView.as_view(), name="log-nutrition"),
    path("log/weight/", LogWeightView.as_view(), name="log-weight"),
]
