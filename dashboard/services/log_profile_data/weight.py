from dashboard.models import DailyWeightLog
from fitness_profile .models import Profile
from fitness_profile.errors import InvalidState, PermissionDenied
from django.utils import timezone


def log_weight(*, user, kg: float) -> Profile:
    if user is None or not user.is_authenticated:   
        raise PermissionDenied("You must be authenticated, please log in ")
    if kg <= 0:
        raise InvalidState("You must log positive hours.. above 0. ")
    
    profile = Profile.objects.get(user=user)
    today = timezone.localdate()
    last_logged_date = profile.last_weight_log.date() if profile.last_weight_log else None
    if last_logged_date != today:
        profile.weight_kg = profile.weight_kg
        profile.last_weight_log = timezone.now()
        
    profile.weight_kg=kg
    profile.save(update_fields=[
        "weight_kg",
        "last_weight_log",
    ])

    log, _ = DailyWeightLog.objects.get_or_create(
        user=user,
        date=today,
        defaults={"weight_kg": kg},
    )
    log.weight_kg = kg
    log.save(update_fields=["weight_kg"])
