from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from fitness_profile.services import (
    user_has_completed_survey,
    get_user_profile,
)
from .services.log_profile_data.sleep import log_sleep
from .services.log_profile_data.hydration import log_daily_water
from .services.log_profile_data.weight import log_weight
from .services.log_profile_data.weight import log_weight
from .services.log_profile_data.calories import log_calories 
from .errors import DomainError
from django.contrib import messages
from .serializers import (
    DailySleepLogSerializer,
    DailyWaterLogSerializer,
    DailyWeightLogSerializer,
    DailyNutritionLogSerializer,
    WaterLogInputSerializer,
)


from .services.analytics import profile_analytics_service
from .services.graph_analytics import get_graph_series

class dashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user

        try:
            analytics = profile_analytics_service(user=user)
            graph_series = get_graph_series(user=user, days=30)
            return Response(
                {
                    "analytics": analytics,
                    "graph_series": graph_series,
                    "survey_completed": True
                },
                status=status.HTTP_200_OK
            )
        except (InvalidState, Exception) as e:
            # If profile doesn't exist or other analytics error
            return Response(
                {
                    "error": str(e),
                    "survey_completed": False
                },
                status=status.HTTP_200_OK # Return 200 so frontend can read survey_completed
            )


class LogWaterView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = WaterLogInputSerializer(data=request.data)
        if serializer.is_valid():
            try:
                profile = log_daily_water(user=request.user, amount_ml=serializer.validated_data["amount_ml"])
                return Response({"new_total": profile.water_today_ml}, status=status.HTTP_201_CREATED)
            except DomainError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogSleepView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = DailySleepLogSerializer(data=request.data)
        if serializer.is_valid():
            try:
                log_sleep(user=request.user, hours=serializer.validated_data["hours"])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except DomainError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogNutritionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = DailyNutritionLogSerializer(data=request.data)
        if serializer.is_valid():
            try:
                log_calories(
                    user=request.user, 
                    calories_amount=serializer.validated_data["calories"],
                    protein_amount=serializer.validated_data["protein"],
                    carb_amount=serializer.validated_data["carbs"],
                    fat_amount=serializer.validated_data["fat"]
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except DomainError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogWeightView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = DailyWeightLogSerializer(data=request.data)
        if serializer.is_valid():
            try:
                log_weight(user=request.user, kg=serializer.validated_data["kg"])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except DomainError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

















