# 🌦 Weather Forecast & Alert Application

A full-stack Weather Forecast & Alert Application that fetches live weather data, analyzes weather conditions, generates weather alerts, and visualizes insights through an interactive dashboard.

Built using:
- Python
- FastAPI
- Open-Meteo API
- Next.js
- Tailwind CSS
- Recharts

--------------------------------------------------

# 📌 Project Overview

This application allows users to:
- Search weather by city
- Fetch live weather data
- Generate weather alerts
- Visualize weather analytics
- Download reports
- Use simulation mode for testing

The system processes:
- temperature
- humidity
- wind speed
- rain probability
- weather conditions

and converts them into meaningful alerts and risk levels.

--------------------------------------------------

# ✨ Features

🌍 Weather Features
- Live weather API integration
- City-wise weather search
- Current weather monitoring
- Rain probability tracking
- Risk level analysis

⚠️ Alert Features
- Heat alerts
- Rain alerts
- Humidity alerts
- Wind alerts
- Storm alerts

📊 Dashboard Features
- Interactive Next.js dashboard
- Dynamic weather charts
- Rainfall analytics
- 4/15/30 day forecast tabs
- Celsius/Fahrenheit switch
- Alert popup modal
- Settings panel
- Downloadable weather reports

🧪 Simulation Features
- Offline testing mode
- Sample weather dataset
- API-independent testing

--------------------------------------------------

# 🛠 Tech Stack

Backend:
- Python
- FastAPI
- Uvicorn
- Requests
- Pandas

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

API:
- Open-Meteo API

Tools:
- VS Code
- Git
- GitHub

--------------------------------------------------

# 📁 Folder Structure

Weather-Forecast-Alert-Application/
│
├── api/
├── src/
├── dashboard/
├── data/
├── outputs/
├── reports/
├── images/
├── docs/
├── main.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md

--------------------------------------------------

# ⚙️ Create Virtual Environment

Windows:
python -m venv venv
.\venv\Scripts\activate

Mac/Linux:
python -m venv venv
source venv/bin/activate

--------------------------------------------------

# 📦 Install Dependencies

Backend:
pip install -r requirements.txt

Frontend:
cd dashboard
npm install

--------------------------------------------------

# ▶️ Run Full Project

Step 1 — Run Backend

python -m uvicorn api.main:app --reload

Backend URL:
http://127.0.0.1:8000

Swagger Docs:
http://127.0.0.1:8000/docs

--------------------------------------------------

Step 2 — Run Frontend

Open second terminal:

cd dashboard
npm run dev

Frontend URL:
http://localhost:3000

--------------------------------------------------

# ▶️ Run Python CLI Version

Simulation Mode:
python main.py --mode simulation --city Pune

API Mode:
python main.py --mode api --city Pune

--------------------------------------------------

# 🌐 API Endpoint

GET /weather?city=Pune&mode=api

--------------------------------------------------

# 🧪 How Simulation Mode Works

Simulation mode uses locally stored sample weather data instead of live API data.

This helps in:
- offline testing
- debugging
- project demonstrations
- safe experimentation

--------------------------------------------------

# 🔁 Workflow

User enters city
        ↓
Frontend sends request
        ↓
FastAPI backend receives request
        ↓
Weather API fetches live data
        ↓
JSON response parsing
        ↓
Alert engine checks thresholds
        ↓
Risk level generated
        ↓
Frontend dashboard updates
        ↓
Charts + alerts + reports generated

--------------------------------------------------

# 📥 Report Generation

Generated Reports:
- reports/alert_report.json
- outputs/weather_report.csv

--------------------------------------------------

# 📌 Sample Console Output

🌦 Weather Forecast & Alert Application
--------------------------------------------------
City: Pune
Temperature: 29.5°C
Humidity: 53%
Wind Speed: 8.6 km/h
Rain Probability: 6%
Condition: Live Weather Data
Risk Level: Low

Alert Output:
✅ Weather is safe. No severe alert.

--------------------------------------------------

# 📸 Screenshots

- images/dashboard-home.png
- images/search-city.png
- images/alerts-panel.png
- images/settings-panel.png
- images/forecast-tabs.png
- images/fastapi-swagger.png

--------------------------------------------------

# 🧠 Key Learnings

- API integration using Python
- FastAPI backend development
- JSON response handling
- Weather data processing
- Alert system development
- Interactive dashboard creation
- Frontend-backend communication
- Data visualization using Recharts
- Full-stack project structuring

--------------------------------------------------

# 🚀 Future Improvements

- Real weather radar integration
- AQI monitoring
- Email/SMS alerts
- Authentication system
- Database integration
- Cloud deployment
- Mobile application

--------------------------------------------------

# 👩‍💻 Author

Vaidehi Deore