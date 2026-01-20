from dashboard.models import DailySleepLog
from fitness_profile .models import Profile
from fitness_profile.errors import InvalidState, PermissionDenied
from django.utils import timezone

def log_sleep(*, user, hours: float) -> Profile:
    if user is None or not user.is_authenticated:   
        raise PermissionDenied("You must be authenticated, please log in ")
    if hours <= 0:
        raise InvalidState("You must log positive hours.. above 0. ")
    
    profile = Profile.objects.get(user=user)
    today = timezone.localdate()
    last_logged_date = profile.last_sleep_log.date() if profile.last_sleep_log else None
    if last_logged_date != today:
        profile.sleep_today_hours = 0
        profile.last_sleep_log = timezone.now()
        
    profile.sleep_today_hours = hours
    profile.save(update_fields=[
        "sleep_today_hours",
        "last_sleep_log",
    ])

    log, _ = DailySleepLog.objects.get_or_create(
        user=user,
        date=today,
        defaults={"hours": hours},
    )
    log.hours = hours
    log.save(update_fields=["hours"])
