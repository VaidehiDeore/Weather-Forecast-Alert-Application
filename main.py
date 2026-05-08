import argparse
from src.simulation_data import sample_weather_data
from src.weather_fetcher import fetch_weather_from_api
from src.alert_engine import generate_alerts, calculate_risk_level
from src.report_generator import save_reports


def display_result(weather_data, alerts, risk_level, csv_path, json_path):
    print("\n🌦 Weather Forecast & Alert Application")
    print("-" * 50)

    print(f"City: {weather_data['city']}")
    print(f"Temperature: {weather_data['temperature']}°C")
    print(f"Humidity: {weather_data['humidity']}%")
    print(f"Wind Speed: {weather_data['wind_speed']} km/h")
    print(f"Rain Probability: {weather_data['rain_probability']}%")
    print(f"Condition: {weather_data['condition']}")
    print(f"Risk Level: {risk_level}")

    print("\nAlert Output:")
    for alert in alerts:
        print(alert)

    print("\nReports Generated:")
    print(f"CSV Report: {csv_path}")
    print(f"JSON Report: {json_path}")


def main():
    parser = argparse.ArgumentParser(description="Weather Forecast & Alert Application")

    parser.add_argument("--mode", choices=["simulation", "api"], default="simulation")
    parser.add_argument("--city", default="Pune")
    parser.add_argument("--temp", type=float, default=38)
    parser.add_argument("--humidity", type=float, default=80)
    parser.add_argument("--wind", type=float, default=40)
    parser.add_argument("--rain", type=float, default=60)

    args = parser.parse_args()

    thresholds = {
        "temperature": args.temp,
        "humidity": args.humidity,
        "wind_speed": args.wind,
        "rain_probability": args.rain
    }

    try:
        if args.mode == "simulation":
            if args.city not in sample_weather_data:
                print("City not found in simulation data. Try Pune, Mumbai, or Delhi.")
                return
            weather_data = sample_weather_data[args.city]

        else:
            weather_data = fetch_weather_from_api(args.city)

        alerts = generate_alerts(weather_data, thresholds)
        risk_level = calculate_risk_level(alerts)
        csv_path, json_path = save_reports(weather_data, alerts, risk_level)

        display_result(weather_data, alerts, risk_level, csv_path, json_path)

    except Exception as error:
        print("❌ Error occurred:")
        print(error)


if __name__ == "__main__":
    main()