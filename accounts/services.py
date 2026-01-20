from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .errors import DuplicateUsername, DuplicateEmail, PermissionDenied, InvalidState, InvalidResetToken
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta
from .emails import send_reset_email
from .models import PasswordResetToken
import secrets
import logging
audit_logger = logging.getLogger("audit")

def create_user(
    *,
    username: str,
    email: str,
    password1: str,
    last_name: str = "",
    first_name: str = "",
):
    if User.objects.filter(username=username).exists():
        raise DuplicateUsername("username already exists")
    if User.objects.filter(email=email).exists():
        raise DuplicateEmail("email already exists")

    return User.objects.create_user(
        username=username,
        email=email,
        password=password1,
        first_name=first_name,
        last_name=last_name
    )

def login_user_service(*, request, username, password):
    
    
    user = authenticate(username = username,
                        password = password,
                        request = request,
                        )
    ip = request.META.get("REMOTE_ADDR")

    if user is None:
        audit_logger.warning(
            "LOGIN FAILED | username=%s | ip=%s",
            username,
            ip,
        )
        raise PermissionDenied("invalid credentials")
    
    
    if not user.is_active:
        audit_logger.warning(
            "LOGIN FAILED | username=%s | ip=%s",
            username,
            ip,
        )
        raise PermissionDenied("Your accounts is disabled, to enable it, confirm email registration.")
    
    
    login(request, user)
    
    audit_logger.info(
    "LOGIN SUCCESS | user_id=%s | ip=%s",
    user.id,
    ip,
)
    return user




def request_password_reset(*, email: str):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return 

    token = secrets.token_hex(32)       
    
    PasswordResetToken.objects.create(
        user=user,
        token=token,
    )

    send_reset_email(user.email, token)

def confirm_password_reset(*, token: str, new_password: str):
    TOKEN_EXPIRATION_MINUTES = 30
    try:
        reset = PasswordResetToken.objects.select_related("user").get(token=token)
    except PasswordResetToken.DoesNotExist:
        raise InvalidResetToken("Invalid or expired token")

    if timezone.now() - reset.created_at > timedelta(minutes=TOKEN_EXPIRATION_MINUTES):
        reset.delete()
        raise InvalidResetToken("Token expired")

    user = reset.user
    user.set_password(new_password)
    user.save()

    reset.delete()

    return user

