from fitness_profile.models import Profile
from fitness_profile.errors import InvalidState, PermissionDenied
from django.utils import timezone
from dashboard.models import DailyWaterLog


def log_daily_water(*, user, amount_ml: float) -> Profile:
    if user is None:
        raise PermissionDenied("You must be authenticated, login and comeback!")
    if amount_ml <= 0:
        raise InvalidState("the amout of water must be positive, above 0ml ")
    
    profile = Profile.objects.get(user=user)
    today = timezone.localdate()
    last_logged_date = profile.last_water_log_date.date() if profile.last_water_log_date else None
    if last_logged_date != today:
        profile.water_today_ml = 0
        profile.last_water_log_date = timezone.now()
        profile.water_percent = 0
        
    profile.water_today_ml += amount_ml
    if profile.water_target_ml:
        profile.water_percent = (profile.water_today_ml / profile.water_target_ml) * 100
    else:
        profile.water_target_ml = 0
        
    if not profile.water_percent:
        profile.water_percent = 0
    
    profile.save(update_fields=[
        "water_today_ml",
        "water_target_ml",
        "last_water_log_date",
        "water_percent"
    ])
    
    #logging per i grafici
    log, _ = DailyWaterLog.objects.get_or_create(
        user=user,
        date=today,
        defaults={"total_ml": 0},
    )
    log.total_ml += amount_ml
    log.save(update_fields=["total_ml"])

    return profile
