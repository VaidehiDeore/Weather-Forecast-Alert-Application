from fastapi import APIRouter, Query
from api.services.weather_service import get_weather_result

router = APIRouter()


@router.get("/weather")
def get_weather(
    city: str = Query(default="Pune"),
    mode: str = Query(default="api")
):
    result = get_weather_result(city=city, mode=mode)
    return result