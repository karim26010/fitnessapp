from .calculators.profile_calculators import calculate_bmi, calculate_tdee, calculate_bmr, calculate_daily_water_intake, calculate_sleep_target, calculate_daily_calories, calculate_macros
from fitness_profile.services import get_user_profile

def _zero_if_none(value: float | None) -> float:
    return 0 if value is None else value

def _remaining_value(target: float | None, current: float) -> float | None:
    if target is None:
        return None
    return max(target - current, 0)

def _percent_value(current: float, target: float | None) -> float:
    return round((current / target) * 100, 1) if target else 0

def profile_analytics_service(*, user) -> dict:
    profile = get_user_profile(user=user)
    today_calories = _zero_if_none(profile.today_calories)
    today_protein = _zero_if_none(profile.today_protein)
    today_carbs = _zero_if_none(profile.today_carbs)
    today_fat = _zero_if_none(profile.today_fat)
    bmi = calculate_bmi (
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
    )
    
    bmr = calculate_bmr (
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
        age=profile.age,
        gender=profile.gender,
    )
    
    tdee = calculate_tdee (
        bmr=bmr,
        activity_level=profile.activity_level,
    )

    sleep_target_hours = calculate_sleep_target(
        age=profile.age
    )
    
    water_target_ml = calculate_daily_water_intake(
        weight_kg=profile.weight_kg,
        activity_level=profile.activity_level,
    )

    
    daily_calories = calculate_daily_calories(
        tdee=tdee, goal= profile.goal, goal_pace=profile.goal_pace
    )
    
    macros = calculate_macros(
        daily_calories=daily_calories,
        goal=profile.goal,
        weight_kg=profile.weight_kg,
    )
    macros_targets = macros or {"protein_g": None, "carbs_g": None, "fat_g": None}
    

    water_status = {
        "today": profile.water_today_ml,
        "target": profile.water_target_ml,
        "percent": profile.water_percent,
    }
    
    sleep_status = {
        "today": profile.sleep_today_hours,
        "target": profile.sleep_target_hours,
        "percent": (
            round((profile.sleep_today_hours / profile.sleep_target_hours) * 100, 1)
            if profile.sleep_today_hours is not None and profile.sleep_target_hours
            else 0
        ),
    }
    
    weight_status = {
        "current": profile.weight_kg,
        "target": profile.target_weight_kg,
        "difference": (
             round(profile.target_weight_kg - profile.weight_kg, 1)
             if profile.target_weight_kg
             else None
        ),
    }
    nutrition_status = {
      "calories": {
        "current": today_calories,
        "target": daily_calories,
        "remaining": (
            _remaining_value(daily_calories, today_calories)
        ),
        "percent": _percent_value(today_calories, daily_calories),
    },
      "protein": {
        "current": today_protein,
        "target": macros_targets["protein_g"],
        "remaining": _remaining_value(macros_targets["protein_g"], today_protein),
        "percent": _percent_value(today_protein, macros_targets["protein_g"]),
    },
      "carbs": {
        "current": today_carbs,
        "target": macros_targets["carbs_g"],
        "remaining": _remaining_value(macros_targets["carbs_g"], today_carbs),
        "percent": _percent_value(today_carbs, macros_targets["carbs_g"]),
    },
    "fat": {
        "current": today_fat,
        "target": macros_targets["fat_g"],
        "remaining": _remaining_value(macros_targets["fat_g"], today_fat),
        "percent": _percent_value(today_fat, macros_targets["fat_g"]),
    },
}

    return {
        "bmi": bmi,
        "bmr": bmr,
        "tdee": tdee,
        "water_target_ml": water_target_ml,
        "sleep_target_hours": sleep_target_hours,
        "daily_calories": daily_calories,
        "macros": macros,
        "water_status": water_status,
        "sleep_status": sleep_status,
        "weight_status": weight_status,
        "nutrition_status": nutrition_status,
        
    }
