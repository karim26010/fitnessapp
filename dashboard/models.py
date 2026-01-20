from django.conf import settings
from django.db import models


class DailyWaterLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    total_ml = models.FloatField(default=0)

    class Meta:
        unique_together = ("user", "date")
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"Water {self.user_id} {self.date}"


class DailySleepLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    hours = models.FloatField(default=0)

    class Meta:
        unique_together = ("user", "date")
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"Sleep {self.user_id} {self.date}"


class DailyWeightLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    weight_kg = models.FloatField()

    class Meta:
        unique_together = ("user", "date")
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"Weight {self.user_id} {self.date}"
