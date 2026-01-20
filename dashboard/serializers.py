from rest_framework import serializers
from .models import DailySleepLog, DailyWaterLog, DailyWeightLog

class DailySleepLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySleepLog
        fields = '__all__'

class DailyWaterLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyWaterLog
        fields = '__all__'

class DailyWeightLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyWeightLog
        fields = '__all__'

class DailyNutritionLogSerializer(serializers.Serializer):
    calories = serializers.FloatField(required=True)
    protein = serializers.FloatField(required=True)
    carbs = serializers.FloatField(required=True)
    fat = serializers.FloatField(required=True)

class WaterLogInputSerializer(serializers.Serializer):
    amount_ml = serializers.FloatField(required=True)
