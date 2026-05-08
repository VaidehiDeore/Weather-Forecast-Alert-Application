def generate_alerts(weather_data, thresholds):
    alerts = []

    temperature = weather_data.get("temperature", 0)
    humidity = weather_data.get("humidity", 0)
    wind_speed = weather_data.get("wind_speed", 0)
    rain_probability = weather_data.get("rain_probability", 0)
    condition = weather_data.get("condition", "").lower()

    if temperature >= thresholds["temperature"]:
        alerts.append("🔥 Heat Alert: Temperature is above safe limit.")

    if humidity >= thresholds["humidity"]:
        alerts.append("💧 Humidity Alert: Humidity level is high.")

    if wind_speed >= thresholds["wind_speed"]:
        alerts.append("🌪 Wind Alert: Strong wind expected.")

    if rain_probability >= thresholds["rain_probability"]:
        alerts.append("🌧 Rain Alert: High chance of rain.")

    if "storm" in condition or "thunder" in condition:
        alerts.append("⛈ Storm Alert: Thunderstorm condition detected.")

    if not alerts:
        alerts.append("✅ Weather is safe. No severe alert.")

    return alerts


def calculate_risk_level(alerts):
    danger_alerts = [a for a in alerts if "Alert" in a]

    if len(danger_alerts) >= 4:
        return "High"
    elif len(danger_alerts) >= 2:
        return "Moderate"
    else:
        return "Low"