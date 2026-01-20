def calculate_bmi(*, height_cm: float, weight_kg: float) -> float | None:
    if height_cm is None or weight_kg is None:
        return None
    if height_cm <= 0 or weight_kg <= 0:
        return None
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)

def calculate_bmr(*, height_cm:float, weight_kg: float, age, gender):
    if height_cm is None or weight_kg is None or age is None or gender is None:
        return None
    if height_cm <= 0 or weight_kg <= 0 or age <= 0:
        return None
    gender = str(gender).lower()

    #BMR
    if gender == 'male':
        return int((10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5)
    elif gender == 'female':
        return int((10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161)
    else:
        return None
     
def calculate_tdee(bmr, activity_level):
    
    if not bmr:
        return None
       
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'high': 1.725,
        'athlete': 1.9
    }

    return int(bmr * activity_multipliers.get(activity_level, 1.55))

def calculate_ideal_weight_devine(*, height_cm: float, gender: str) -> float | None:
    if not height_cm or not gender:
        return None

    gender = gender.lower()
    inches_over_5ft = max(0, (height_cm - 152.4) / 2.54)

    if gender == "male":
        return round(50 + inches_over_5ft * 2.3, 1)
    elif gender == "female":
        return round(45.5 + inches_over_5ft * 2.3, 1)

    return None



def get_sleep_quality(sleep_today_hours):
    """Get sleep quality assessment"""
    if sleep_today_hours < 5:
        return 'Poor'
    elif sleep_today_hours < 6.5:
        return 'Fair'
    elif sleep_today_hours < 9:
        return 'Good'
    else:
        return 'Excellent'
    
def calculate_sleep_target(*, age: int) -> float | None:
    if age is None or age <= 0:
        return None
    if age <= 13:
        return 9.5
    elif age <= 17:
        return 9
    elif age <= 64:
        return 8
    else:
        return 7


def calculate_daily_water_intake(*, weight_kg: float, activity_level: str) -> int | None:
    if weight_kg is None or weight_kg <= 0:
        return None

    base_ml = weight_kg * 35

    activity_bonus_ml = {
        "sedentary": 0,
        "light": 350,
        "moderate": 500,
        "high": 750,
        "athlete": 1000,
    }

    return int(base_ml + activity_bonus_ml.get(activity_level, 500))


def calculate_daily_calories(*, tdee: int, goal: str, goal_pace: str) -> int | None:
    if tdee is None or tdee <= 0:
        return None

    multipliers = {
        "cut": {"mild": 0.90, "moderate": 0.85, "aggressive": 0.80},
        "bulk": {"mild": 1.05, "moderate": 1.10, "aggressive": 1.15},
        "maintain": {"mild": 1.00, "moderate": 1.00, "aggressive": 1.00},
    }

    goal_key = goal if goal in multipliers else "maintain"
    pace_key = goal_pace if goal_pace in multipliers.get(goal_key, {}) else "moderate"
    multiplier = multipliers[goal_key][pace_key]
    calories = int(tdee * multiplier)

    return calories


    
def calculate_macros(*, daily_calories: int, goal: str, weight_kg: float):
    if daily_calories is None or daily_calories <= 0 or weight_kg is None or weight_kg <= 0:
        return None

    protein_factors = {
        "cut": 2.0,
        "bulk": 1.8,
        "maintain": 1.6,
    }
    protein_g = int(weight_kg * protein_factors.get(goal, 1.6))
    fat_percentages = {
        "cut": 0.22,
        "bulk": 0.28,
        "maintain": 0.25,
    }
    fat_g = int((daily_calories * fat_percentages.get(goal, 0.25)) / 9)
    fat_floor_g = int(weight_kg * 0.6)
    fat_g = max(fat_g, fat_floor_g)
    max_fat_g = max(0, int((daily_calories - (protein_g * 4)) / 9))
    fat_g = min(fat_g, max_fat_g)


    remaining_cals = daily_calories - (protein_g * 4) - (fat_g * 9)
    carbs_g = max(0, int(remaining_cals / 4))

    return {
        "protein_g": protein_g,
        "fat_g": fat_g,
        "carbs_g": carbs_g,
    }
