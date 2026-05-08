import os
import json
import pandas as pd
from datetime import datetime


def save_reports(weather_data, alerts, risk_level):
    os.makedirs("outputs", exist_ok=True)
    os.makedirs("reports", exist_ok=True)

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    csv_path = f"outputs/weather_report_{timestamp}.csv"
    json_path = f"reports/alert_report_{timestamp}.json"

    report_data = {
        "timestamp": timestamp,
        "city": weather_data.get("city"),
        "temperature": weather_data.get("temperature"),
        "humidity": weather_data.get("humidity"),
        "wind_speed": weather_data.get("wind_speed"),
        "rain_probability": weather_data.get("rain_probability"),
        "condition": weather_data.get("condition"),
        "risk_level": risk_level,
        "alerts": alerts
    }

    df = pd.DataFrame([report_data])
    df.to_csv(csv_path, index=False)

    with open(json_path, "w", encoding="utf-8") as file:
        json.dump(report_data, file, indent=4)

    return csv_path, json_path