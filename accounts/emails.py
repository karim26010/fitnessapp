from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_reset_email(email: str, token: str):
    # Match the configured URL pattern: /reset/<token>/
    reset_url = f"http://localhost:8000/reset/{token}/"

    subject = "Reset your password"

    html_content = f"""
        <p>Click the link below to reset your password:</p>
        <p><a href="{reset_url}">Reset password</a></p>
    """

    msg = EmailMultiAlternatives(
        subject=subject,
        body="Reset your password",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )

    msg.attach_alternative(html_content, "text/html")
    msg.send()
