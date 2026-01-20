from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .services import create_user, login_user_service, request_password_reset, confirm_password_reset
from .errors import DomainError

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = create_user(
                    username=serializer.validated_data['username'],
                    email=serializer.validated_data['email'],
                    password1=serializer.validated_data['password1'],
                    first_name=serializer.validated_data.get('first_name', ''),
                    last_name=serializer.validated_data.get('last_name', '')
                )
                return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
            except DomainError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = login_user_service(
                    request=request,
                    username=serializer.validated_data['username'],
                    password=serializer.validated_data['password']
                )
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    "token": token.key,
                    "user": UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            except DomainError as e:
                return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            logout(request) # Optional based on session usage handling
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception:
             return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if email:
            try:
                request_password_reset(email=email)
                return Response({"message": "If the email exists, a reset link has been sent."}, status=status.HTTP_200_OK)
            except DomainError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
