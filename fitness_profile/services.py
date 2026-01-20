from django.contrib.auth.models import User
from .models import Profile
from .errors import InvalidState, PermissionDenied


def fitness_survey_service(*, user, **data):
    if user is None or not user.is_authenticated:
        raise PermissionDenied("Authentication required")

    if Profile.objects.filter(user=user).exists():
        raise InvalidState("Survey already completed")

    weight_kg = data.get("weight_kg")
    target_weight_kg = data.get("target_weight_kg")
    goal = data.get("goal")   

    if goal == "bulk" and target_weight_kg and target_weight_kg <= weight_kg:
        raise InvalidState("Target weight must be higher for muscle gain")

    if goal == "cut" and target_weight_kg and target_weight_kg >= weight_kg:
        raise InvalidState("Target weight must be lower for fat loss")

    return Profile.objects.create(user=user, **data)


def user_has_completed_survey(*, user) -> bool:
    if user is None or not user.is_authenticated:
        raise PermissionDenied("Authentication required")

    return Profile.objects.filter(user=user).exists()

def get_user_profile(*, user):
    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        raise InvalidState("Profile doesnt exist")
    return profile
    
def update_profile_survey(*, user, **data):
    if user is None or not user.is_authenticated:
        raise PermissionDenied("Authentication required")

    profile = get_user_profile(user=user)

    weight_kg = data.get("weight_kg")
    target_weight_kg = data.get("target_weight_kg")
    goal = data.get("goal")   

    if goal == "bulk" and target_weight_kg and target_weight_kg <= weight_kg:
        raise InvalidState("Target weight must be higher for muscle gain")

    if goal == "cut" and target_weight_kg and target_weight_kg >= weight_kg:
        raise InvalidState("Target weight must be lower for fat loss")

    for field, value in data.items():
        if hasattr(profile, field):
            setattr(profile, field, value)

    profile.save()
    return profile
