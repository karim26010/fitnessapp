from datetime import timedelta

from django.utils import timezone

from dashboard.models import DailyWeightLog, DailySleepLog, DailyWaterLog


def _build_series(*, logs, days, value_attr):
    today = timezone.localdate()
    start = today - timedelta(days=days - 1)
    values_by_date = {log.date: getattr(log, value_attr) for log in logs}

    series = []
    for i in range(days):
        day = start + timedelta(days=i)
        series.append({
            "date": day,
            "value": values_by_date.get(day),
        })
    return series


def _chart_payload(*, series, unit):
    labels = [point["date"].isoformat() for point in series]
    data = [point["value"] for point in series]
    return {
        "labels": labels,
        "data": data,
        "unit": unit,
        "series": series,
    }


def hydration_series(*, user, days=30):
    logs = (
        DailyWaterLog.objects
        .filter(user=user)
        .filter(date__gte=timezone.localdate() - timedelta(days=days - 1))
        .order_by("date")
    )

    return _build_series(logs=logs, days=days, value_attr="total_ml")

def sleep_series(*, user, days=30):
    logs = (
        DailySleepLog.objects
        .filter(user=user)
        .filter(date__gte=timezone.localdate() - timedelta(days=days - 1))
        .order_by("date")
    )

    return _build_series(logs=logs, days=days, value_attr="hours")
def weight_series(*, user, days=30):
    logs = (
        DailyWeightLog.objects
        .filter(user=user)
        .filter(date__gte=timezone.localdate() - timedelta(days=days - 1))
        .order_by("date")
    )

    return _build_series(logs=logs, days=days, value_attr="weight_kg")


def get_graph_series(*, user, days=30):
    hydration = hydration_series(user=user, days=days)
    sleep = sleep_series(user=user, days=days)
    weight = weight_series(user=user, days=days)
    return {
        "hydration": _chart_payload(series=hydration, unit="ml"),
        "sleep": _chart_payload(series=sleep, unit="hours"),
        "weight": _chart_payload(series=weight, unit="kg"),
        "range_days": days,
    }
