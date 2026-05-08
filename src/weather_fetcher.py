import requests


def get_city_coordinates(city):
    geo_url = (
        "https://geocoding-api.open-meteo.com/v1/search"
        f"?name={city}&count=1&language=en&format=json"
    )

    response = requests.get(geo_url, timeout=15)
    response.raise_for_status()

    data = response.json()

    if "results" not in data or len(data["results"]) == 0:
        raise ValueError(f"City not found: {city}")

    result = data["results"][0]

    return {
        "name": result.get("name", city),
        "country": result.get("country", ""),
        "lat": result["latitude"],
        "lon": result["longitude"],
        "timezone": result.get("timezone", "Asia/Kolkata")
    }


def fetch_weather_from_api(city):
    location = get_city_coordinates(city)

    lat = location["lat"]
    lon = location["lon"]
    timezone = location["timezone"]

    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}"
        f"&longitude={lon}"
        "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation"
        "&hourly=precipitation_probability"
        f"&timezone={timezone}"
    )

    response = requests.get(url, timeout=15)
    response.raise_for_status()

    data = response.json()
    current = data["current"]

    rain_probability = 0
    if "hourly" in data and "precipitation_probability" in data["hourly"]:
        rain_values = data["hourly"]["precipitation_probability"][:6]
        rain_probability = max(rain_values) if rain_values else 0

    weather_data = {
        "city": location["name"],
        "country": location["country"],
        "temperature": current.get("temperature_2m", 0),
        "humidity": current.get("relative_humidity_2m", 0),
        "wind_speed": current.get("wind_speed_10m", 0),
        "rain_probability": rain_probability,
        "condition": "Live Weather Data"
    }

    return weather_data