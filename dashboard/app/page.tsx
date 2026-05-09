"use client";

import { useState } from "react";
import {
  Bell,
  Settings,
  BarChart3,
  Home,
  Search,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  Download,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type WeatherResponse = {
  weather: {
    city: string;
    country?: string;
    temperature: number;
    humidity: number;
    wind_speed: number;
    rain_probability: number;
    condition: string;
  };
  alerts: string[];
  risk_level: string;
};

export default function HomePage() {
  const [city, setCity] = useState("Pune");
  const [mode, setMode] = useState("api");
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [activeSection, setActiveSection] = useState("Home");
  const [forecastTab, setForecastTab] = useState<"4 Days" | "15 Days" | "30 Days">("4 Days");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [thresholds, setThresholds] = useState({
    temperature: 38,
    humidity: 80,
    wind: 40,
    rain: 60,
  });

  const weather = data?.weather;

  const fetchWeather = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://127.0.0.1:8000/weather?city=${city}&mode=${mode}`
      );

      if (!res.ok) {
        throw new Error("City not found or backend error.");
      }

      const result = await res.json();
      setData(result);
    } catch {
      alert("Unable to fetch weather. Please check city name and backend server.");
    } finally {
      setLoading(false);
    }
  };

  const convertTemp = (temp: number) => {
    if (unit === "F") return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  const unitSymbol = unit === "C" ? "°C" : "°F";

  const generateHourlyData = () => {
    const baseTemp = weather?.temperature ?? 25;
    const rain = weather?.rain_probability ?? 20;

    return [
      { time: "7 AM", temp: Math.round(baseTemp - 5), rain: Math.max(rain - 20, 0) },
      { time: "8 AM", temp: Math.round(baseTemp - 3), rain: Math.max(rain - 15, 0) },
      { time: "9 AM", temp: Math.round(baseTemp - 1), rain: Math.max(rain - 10, 0) },
      { time: "10 AM", temp: Math.round(baseTemp + 1), rain },
      { time: "11 AM", temp: Math.round(baseTemp + 3), rain: rain + 5 },
      { time: "12 PM", temp: Math.round(baseTemp + 4), rain: rain + 8 },
      { time: "1 PM", temp: Math.round(baseTemp + 3), rain: rain + 6 },
      { time: "2 PM", temp: Math.round(baseTemp + 2), rain: rain + 3 },
      { time: "3 PM", temp: Math.round(baseTemp), rain },
      { time: "4 PM", temp: Math.round(baseTemp - 2), rain: Math.max(rain - 5, 0) },
    ];
  };

  const generateRainfallData = () => {
    const rain = weather?.rain_probability ?? 30;

    return Array.from({ length: 10 }, (_, index) => ({
      day: String(index),
      rain: Math.min(200, rain + index * 8 + 20),
      sun: Math.max(40, 180 - rain - index * 5),
    }));
  };

  const generateForecastData = () => {
    const baseTemp = weather?.temperature ?? 25;
    const rain = weather?.rain_probability ?? 30;

    const status =
      rain > 60 ? "Rainy" : baseTemp > 38 ? "Hot" : rain > 30 ? "Cloudy" : "Clear";

    const icon =
      rain > 60 ? "🌧️" : baseTemp > 38 ? "☀️" : rain > 30 ? "☁️" : "🌤️";

    return {
      "4 Days": [
        { day: "Tomorrow", status, temp: baseTemp + 1, icon },
        {
          day: "Day 2",
          status: rain > 50 ? "Rain Chance" : "Partly Cloudy",
          temp: baseTemp,
          icon: rain > 50 ? "🌧️" : "🌤️",
        },
        {
          day: "Day 3",
          status: baseTemp > 36 ? "Warm" : "Moderate",
          temp: baseTemp + 2,
          icon: baseTemp > 36 ? "☀️" : "☁️",
        },
        {
          day: "Day 4",
          status: "Stable Weather",
          temp: baseTemp - 1,
          icon: "🌤️",
        },
      ],
      "15 Days": [
        { day: "Days 1-3", status, temp: baseTemp + 1, icon },
        {
          day: "Days 4-7",
          status: "Moderate Variation",
          temp: baseTemp - 1,
          icon: "☁️",
        },
        {
          day: "Days 8-11",
          status: rain > 45 ? "Rain Possible" : "Clear",
          temp: baseTemp + 2,
          icon: rain > 45 ? "🌧️" : "☀️",
        },
        {
          day: "Days 12-15",
          status: "Forecast Stable",
          temp: baseTemp,
          icon: "🌤️",
        },
      ],
      "30 Days": [
        { day: "Week 1", status, temp: baseTemp + 1, icon },
        {
          day: "Week 2",
          status: rain > 50 ? "Wet Week" : "Dry Week",
          temp: baseTemp - 2,
          icon: rain > 50 ? "🌧️" : "☀️",
        },
        {
          day: "Week 3",
          status: "Seasonal Pattern",
          temp: baseTemp + 2,
          icon: "🌦️",
        },
        {
          day: "Week 4",
          status: "Long Range Estimate",
          temp: baseTemp,
          icon: "☁️",
        },
      ],
    };
  };

  const dynamicHourlyData = generateHourlyData();
  const dynamicRainfallData = generateRainfallData();
  const dynamicForecastData = generateForecastData();

  const downloadReport = () => {
    const report = {
      generated_at: new Date().toLocaleString(),
      city: weather?.city || city,
      mode,
      weather,
      alerts: data?.alerts || [],
      risk_level: data?.risk_level || "Low",
      thresholds,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `weather_report_${city}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sidebarItems = [
    { name: "Home", icon: Home },
    { name: "Weather", icon: CloudSun },
    { name: "Analytics", icon: BarChart3 },
    { name: "Alerts", icon: Bell },
    { name: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-[#4c5368] flex items-center justify-center p-6">
      <div className="w-full max-w-[1180px] rounded-[28px] bg-[#eef2f8] shadow-2xl overflow-hidden flex">
        <aside className="w-[90px] bg-[#eef2f8] px-5 py-8 hidden md:flex flex-col items-center gap-7">
          <div className="text-3xl text-slate-700">☰</div>

          <div className="mt-8 flex flex-col gap-5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveSection(item.name);
                    if (item.name === "Alerts") setShowAlerts(true);
                    if (item.name === "Settings") setShowSettings(true);
                  }}
                  className={`p-4 rounded-2xl shadow transition ${
                    activeSection === item.name
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-white text-slate-700 hover:bg-blue-50"
                  }`}
                  title={item.name}
                >
                  <Icon />
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex-1 bg-[#f7f9fd] p-6 space-y-5 overflow-y-auto max-h-screen">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e376d] to-[#061b4f] text-white p-7 shadow-xl">
            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />

            <div className="relative z-10">
              <div className="flex justify-between items-start">
                {
                 (() => {
                  const hour = new Date().getHours();

                   let greeting = "Good Evening";

                if (hour < 12) {
                greeting = "Good Morning";
                } else if (hour < 17) {
                greeting = "Good Afternoon";
                } else {
                greeting = "Good Evening";
                }

                return (
                <h1 className="text-2xl font-bold">
                {greeting}, Vaidehi 👋
                </h1>
                );
                })()
       }

                <button
                  onClick={() => setShowMap(true)}
                  className="flex gap-2 bg-white/15 px-4 py-3 rounded-xl backdrop-blur-md hover:bg-white/25 transition"
                >
                  <MapPin size={18} />
                  <span className="text-sm">
                    {weather?.city || city}, {weather?.country || "India"}
                  </span>
                </button>
              </div>

              <h2 className="text-6xl font-bold mt-10">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h2>

              <p className="mt-3 text-sm opacity-90">{new Date().toDateString()}</p>

              <div className="mt-7">
                <p className="text-sm opacity-80">Weather Forecast</p>
                <h3 className="text-2xl font-bold mt-1">
                  {weather?.condition || "Partly Cloudy"}
                </h3>
                <p className="text-sm mt-1">
                  Rain Probability: {weather?.rain_probability ?? 30}%
                </p>
              </div>

              <div className="absolute right-8 bottom-8 text-7xl">🌦️</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 border rounded-xl px-4">
              <Search size={18} />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full py-3 outline-none"
                placeholder="Enter city e.g. Pune"
              />
            </div>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border rounded-xl px-4"
            >
              <option value="api">API Mode</option>
              <option value="simulation">Simulation Mode</option>
            </select>

            <button
              onClick={fetchWeather}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
            >
              {loading ? "Checking..." : "Check Weather"}
            </button>

            <button
              onClick={downloadReport}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold shadow flex items-center gap-2"
            >
              <Download size={18} />
              Report
            </button>
          </div>

          {(activeSection === "Home" || activeSection === "Weather") && (
            <div className="bg-white rounded-3xl p-5 shadow">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800">Hourly Forecast</h3>
                <p className="text-sm text-slate-500">Showing: {city}</p>
              </div>

              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={dynamicHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#3457ff"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {(activeSection === "Home" || activeSection === "Analytics") && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-3xl p-5 shadow">
                <h3 className="font-bold text-lg text-slate-800 mb-3">
                  Rainfall Analytics
                </h3>

                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={dynamicRainfallData}>
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="rain" fill="#335bdb" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="sun" fill="#b8c7ff" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <button
                onClick={() => setShowMap(true)}
                className="bg-white rounded-3xl p-5 shadow text-left hover:scale-[1.01] transition"
              >
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg text-slate-800">
                    Interactive Weather Map
                  </h3>
                  <p className="text-xs text-blue-600">Open Map</p>
                </div>

                <div className="h-[170px] mt-3 rounded-2xl bg-gradient-to-br from-blue-100 via-yellow-100 to-orange-200 flex items-center justify-center text-7xl">
                  🌍
                </div>
              </button>
            </div>
          )}

          {activeSection === "Alerts" && (
            <div className="bg-white rounded-3xl p-6 shadow">
              <h3 className="font-bold text-xl mb-4">Weather Alerts</h3>
              {(data?.alerts || ["No live alert data yet. Search a city first."]).map(
                (alert, index) => (
                  <div
                    key={index}
                    className="mb-3 p-4 rounded-xl bg-orange-50 border border-orange-200 text-slate-800"
                  >
                    {alert}
                  </div>
                )
              )}
            </div>
          )}

          {activeSection === "Settings" && (
            <div className="bg-white rounded-3xl p-6 shadow">
              <h3 className="font-bold text-xl mb-4">Alert Threshold Settings</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(thresholds).map(([key, value]) => (
                  <label key={key} className="space-y-2">
                    <p className="capitalize font-medium">{key} Threshold</p>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setThresholds({
                          ...thresholds,
                          [key]: Number(e.target.value),
                        })
                      }
                      className="w-full border rounded-xl px-4 py-3"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="w-[330px] bg-gradient-to-b from-[#061b62] to-[#04103d] text-white p-6 hidden lg:block">
          <div className="flex justify-end gap-4">
            <button onClick={() => setShowAlerts(true)} className="relative">
              <Bell size={22} />
              {data?.alerts && data.alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold"
            >
              V
            </button>
          </div>

          <div className="text-center mt-10">
            <div className="text-8xl">🌦️</div>
            <h2 className="text-5xl font-bold mt-3">
              {convertTemp(weather?.temperature ?? 20)}
              {unitSymbol}
            </h2>
            <p className="mt-2 text-lg">{weather?.condition || "Partly Cloudy"}</p>
          </div>

          <div className="mt-8 space-y-4 border-b border-white/20 pb-6">
            <div className="flex justify-between">
              <span className="flex gap-2">
                <Wind size={18} /> Wind
              </span>
              <span>{weather?.wind_speed ?? 20} Km/h</span>
            </div>

            <div className="flex justify-between">
              <span className="flex gap-2">
                <Droplets size={18} /> Hum
              </span>
              <span>{weather?.humidity ?? 15}%</span>
            </div>

            <div className="flex justify-between">
              <span className="flex gap-2">
                <Thermometer size={18} /> Risk
              </span>
              <span>{data?.risk_level || "Low"}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Weather Forecast</h3>

              <button
                onClick={() => setUnit(unit === "C" ? "F" : "C")}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-sm"
              >
                {unit === "C" ? "Celsius" : "Fahrenheit"}
              </button>
            </div>

            <div className="flex mt-5 bg-white/10 rounded-2xl p-1">
              {(["4 Days", "15 Days", "30 Days"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setForecastTab(tab)}
                  className={`flex-1 rounded-xl py-2 ${
                    forecastTab === tab ? "bg-blue-600" : "hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {dynamicForecastData[forecastTab].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-white/10 pb-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="text-sm">{item.day}</p>
                      <p className="text-xs text-white/60">{item.status}</p>
                    </div>
                  </div>
                  <p>
                    {convertTemp(item.temp)}
                    {unitSymbol}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {showAlerts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <AlertTriangle className="text-orange-500" />
                Alert Center
              </h3>
              <button onClick={() => setShowAlerts(false)}>
                <X />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {(data?.alerts || ["No alerts available. Search a city first."]).map(
                (alert, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-blue-50 border border-blue-100"
                  >
                    {alert}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">Threshold Settings</h3>
              <button onClick={() => setShowSettings(false)}>
                <X />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-5">
              {Object.entries(thresholds).map(([key, value]) => (
                <label key={key} className="space-y-2">
                  <p className="capitalize font-medium">{key}</p>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setThresholds({
                        ...thresholds,
                        [key]: Number(e.target.value),
                      })
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-5 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">Interactive Weather Map</h3>
              <button onClick={() => setShowMap(false)}>
                <X />
              </button>
            </div>

            <div className="mt-5 h-[360px] rounded-2xl bg-gradient-to-br from-blue-100 via-yellow-100 to-orange-200 flex items-center justify-center text-center">
              <div>
                <div className="text-8xl">🌍</div>
                <p className="font-semibold mt-4">
                  Map Preview for {weather?.city || city}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Radar/map visualization section for weather monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}