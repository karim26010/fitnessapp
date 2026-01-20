from django import forms


class FitnessSurveyForm(forms.Form):
    # ───────────────
    # BASIC INFO
    # ───────────────
    gender = forms.ChoiceField(
        choices=[
            ("male", "Male"),
            ("female", "Female"),
            ("other", "Other"),
        ]
    )

    age = forms.IntegerField(min_value=10, max_value=100)

    height_cm = forms.FloatField(min_value=50)
    weight_kg = forms.FloatField(min_value=20)


    # ───────────────
    # GOALS & ACTIVITY
    # ───────────────
    goal = forms.ChoiceField(
        choices=[
            ("cut", "Fat Loss"),
            ("bulk", "Muscle Gain"),
            ("maintain", "Maintenance"),
        ]
    )

    goal_pace = forms.ChoiceField(
        choices=[
            ("mild", "Mild"),
            ("moderate", "Moderate"),
            ("aggressive", "Aggressive"),
        ]
    )

    fitness_level = forms.ChoiceField(
        choices=[
            ("beginner", "Beginner"),
            ("intermediate", "Intermediate"),
            ("advanced", "Advanced"),
        ]
    )

    activity_level = forms.ChoiceField(
        choices=[
            ("sedentary", "Sedentary"),
            ("light", "Light"),
            ("moderate", "Moderate"),
            ("high", "High"),
            ("athlete", "Athlete"),
        ]
    )

    # ───────────────
    # TARGETS
    # ───────────────
    target_weight_kg = forms.FloatField(
        required=False,
        min_value=20
    )

    sleep_target_hours = forms.FloatField(
        min_value=0,
        max_value=24
    )

    water_target_ml = forms.FloatField(
        min_value=1000,
        max_value=10000,
    )
