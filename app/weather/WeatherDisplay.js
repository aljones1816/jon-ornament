"use client";

import React, { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard";
import styles from "../../styles/Weather.module.css";

export default function WeatherDisplay() {
  const [today, setToday] = useState(null);
  const [forecast, setForecast] = useState(null);

  async function fetchWeather() {
    try {
      const response = await fetch("/api/weather");
      if (!response.ok) throw new Error("Failed to fetch weather data");

      const data = await response.json();
      setToday(data.today);
      setForecast(data.forecast);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!today || !forecast) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        <WeatherCard
          title={today.title}
          temp={`Now: ${today.temp}°F, H: ${today.high}°F / L: ${today.low}°F`}
          condition={today.condition}
          icon={today.icon}
        />
        {forecast.map((day, index) => (
          <WeatherCard
            key={index}
            title={day.title}
            temp={`H: ${day.high}°F / L: ${day.low}°F`}
            condition={day.condition}
            icon={day.icon}
          />
        ))}
      </div>
    </div>
  );
}
