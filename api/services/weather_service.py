from src.simulation_data import sample_weather_data
from src.weather_fetcher import fetch_weather_from_api
from src.alert_engine import generate_alerts, calculate_risk_level


def get_weather_result(city="Pune", mode="api"):
    thresholds = {
        "temperature": 38,
        "humidity": 80,
        "wind_speed": 40,
        "rain_probability": 60
    }

    if mode == "simulation":
        if city not in sample_weather_data:
            raise ValueError("City not found in simulation data.")
        weather_data = sample_weather_data[city]
    else:
        weather_data = fetch_weather_from_api(city)

    alerts = generate_alerts(weather_data, thresholds)
    risk_level = calculate_risk_level(alerts)

    return {
        "weather": weather_data,
        "alerts": alerts,
        "risk_level": risk_level
    }