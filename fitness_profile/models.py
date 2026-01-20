from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    # ─────────────────────────
    # BASIC PROFILE
    # ─────────────────────────
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    gender = models.CharField(max_length=10, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)

    height_cm = models.FloatField(null=True, blank=True)
    
    #weight 
    weight_kg = models.FloatField(null=True, blank=True)
    last_weight_log = models.DateTimeField(null=True, blank=True)

    timezone = models.CharField(
        max_length=50,
        default="UTC",
        help_text="IANA timezone, e.g. Europe/Rome"
    )

    # ─────────────────────────
    # FITNESS PROFILE
    # ─────────────────────────
    GOAL_CHOICES = [
        ("cut", "Fat Loss"),
        ("bulk", "Muscle Gain"),
        ("maintain", "Maintenance"),
    ]

    goal = models.CharField(
        max_length=20,
        choices=GOAL_CHOICES,
        default="maintain",
    )

    PACE_CHOICES = [
        ("mild", "Mild"),
        ("moderate", "Moderate"),
        ("aggressive", "Aggressive"),
    ]

    goal_pace = models.CharField(
        max_length=20,
        choices=PACE_CHOICES,
        default="moderate",
    )

    target_weight_kg = models.FloatField(null=True, blank=True)

    FITNESS_LEVEL_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    fitness_level = models.CharField(
        max_length=20,
        choices=FITNESS_LEVEL_CHOICES,
        default="beginner",
    )

    ACTIVITY_LEVEL_CHOICES = [
        ("sedentary", "Sedentary"),
        ("light", "Light Activity"),
        ("moderate", "Moderate Activity"),
        ("high", "High Activity"),
        ("athlete", "Athlete"),
    ]

    activity_level = models.CharField(
        max_length=20,
        choices=ACTIVITY_LEVEL_CHOICES,
        default="moderate",
    )

    # ─────────────────────────
    # DAILY HABITS
    # ─────────────────────────
    sleep_target_hours = models.FloatField(null=True, blank=True)
    sleep_today_hours = models.FloatField(null=True, blank=True)
    last_sleep_log = models.DateTimeField(null=True, blank=True)
    sleep_percent = models.FloatField(null=True, blank=True)


    water_target_ml = models.FloatField(null=True, blank=True)
    water_today_ml = models.FloatField(null=True, blank=True)
    last_water_log_date = models.DateTimeField(null=True, blank=True)
    water_percent = models.FloatField(null=True, blank=True)

    # ─────────────────────────
    # NUTRITION TARGETS
    # ─────────────────────────
    daily_calories = models.FloatField(null=True, blank=True)
    today_calories = models.FloatField(null=True, blank=True)
    last_nutrition_log_date = models.DateTimeField(null=True, blank=True)
    calories_percent = models.FloatField(null=True, blank=True)
    

    protein_g = models.FloatField(null=True, blank=True)
    today_protein = models.FloatField(null=True, blank=True)
    protein_percent =  models.FloatField(null=True, blank=True)
    
    
    carbs_g = models.FloatField(null=True, blank=True)
    today_carbs =models.FloatField(null=True, blank=True)
    carbs_percent =  models.FloatField(null=True, blank=True)
    
    
    fat_g = models.FloatField(null=True, blank=True)
    today_fat =models.FloatField(null=True, blank=True)
    fat_percent = models.FloatField(null=True, blank=True)
    

    MACRO_STYLE_CHOICES = [
        ("balanced", "Balanced"),
        ("high_carb", "High Carb"),
        ("high_fat", "High Fat"),
    ]

    macro_style = models.CharField(
        max_length=20,
        choices=MACRO_STYLE_CHOICES,
        default="balanced",
    )

    calorie_goal_override = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Custom calorie target override"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
