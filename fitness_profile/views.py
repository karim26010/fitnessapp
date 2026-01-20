from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .services import (
    fitness_survey_service,
    user_has_completed_survey,
    get_user_profile,
    update_profile_survey
)
from .serializers import FitnessSurveySerializer, ProfileSerializer
from .errors import DomainError
from dashboard.services.analytics import profile_analytics_service


class FitnessSurveyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FitnessSurveySerializer(data=request.data)
        if serializer.is_valid():
            try:
                fitness_survey_service(user=request.user, **serializer.validated_data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except DomainError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = get_user_profile(user=request.user)
        except DomainError:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        profile_data = ProfileSerializer(profile).data
        analytics_data = profile_analytics_service(user=request.user)

        return Response(
            {"profile": profile_data, "analytics": analytics_data},
            status=status.HTTP_200_OK
        )


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            profile = get_user_profile(user=request.user)
        except DomainError:
             return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = FitnessSurveySerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                update_profile_survey(user=request.user, **serializer.validated_data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except DomainError as e:
                print(f"UpdateProfileView DomainError: {e}")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        print(f"UpdateProfileView Serializer Errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
