from fitness_profile.models import Profile
from fitness_profile.errors import InvalidState, PermissionDenied
from django.utils import timezone

def log_calories(*, user, calories_amount: float, protein_amount: float, fat_amount: float, carb_amount: float) -> Profile:
    if user is None:
        raise PermissionDenied("You must be authenticated, login and comeback!")
    if calories_amount <= 0:
        raise InvalidState("You should try and log something that exists, you can't eat negative energy..") 
    
    profile = Profile.objects.get(user=user)
    today = timezone.localdate()
     
    last_logged_date = profile.last_nutrition_log_date.date() if profile.last_nutrition_log_date else None
    if last_logged_date != today:
        profile.today_calories = 0
        profile.today_carbs = 0
        profile.today_protein = 0
        profile.today_fat = 0
        
        profile.calories_percent = 0
        profile.protein_percent = 0
        profile.carbs_percent = 0
        profile.fat_percent = 0
        
        profile.last_nutrition_log_date = timezone.now()

    profile.today_calories = (profile.today_calories or 0) + calories_amount
    profile.today_protein = (profile.today_protein or 0) + protein_amount
    profile.today_carbs = (profile.today_carbs or 0) + carb_amount
    profile.today_fat = (profile.today_fat or 0) + fat_amount

    if profile.daily_calories:
        profile.calories_percent = (profile.today_calories / profile.daily_calories) * 100
    else:
        profile.calories_percent = 0
    
    profile.save(update_fields=[
        "last_nutrition_log_date",
        "today_calories",
        "today_protein",
        "today_carbs",
        "today_fat",
        "daily_calories",
        "calories_percent",
        "protein_percent",
        "carbs_percent",
        "fat_percent"
    ])
    
    #macros
     #proteins
    if protein_amount <= 0:
        raise InvalidState("You should try and log something that exists, you can't eat negative energy..") 
