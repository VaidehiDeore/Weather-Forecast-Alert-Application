from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.weather import router as weather_router

app = FastAPI(
    title="Weather Forecast & Alert API",
    description="API for live weather data, forecast risk analysis, and alert generation.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather_router)


@app.get("/")
def home():
    return {
        "message": "Weather Forecast & Alert API is running",
        "docs": "Open /docs to test API"
    }