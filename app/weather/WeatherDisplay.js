import React from 'react';
import WeatherCard from './WeatherCard';
import styles from '../../styles/Weather.module.css';

export default async function WeatherDisplay() {
    const WEATHERAPI_API_KEY = process.env.WEATHERAPI_API_KEY;

    // Fetch current weather and forecast
    const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?q=02139&key=${WEATHERAPI_API_KEY}&days=3`,
        { cache: 'no-store' }
    );

    if (!response.ok) {
        return <p>Failed to load weather data.</p>;
    }

    const data = await response.json();

    // Extract required information
    const today = {
        date: data.forecast.forecastday[0].date,
        temp: Math.floor(data.current.temp_f),
        high: Math.floor(data.forecast.forecastday[0].day.maxtemp_f),
        low: Math.floor(data.forecast.forecastday[0].day.mintemp_f),
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        title: "Today"
    };

    const forecast = data.forecast.forecastday.slice(1).map((day) => ({
        date: day.date,
        high: Math.floor(day.day.maxtemp_f),
        low: Math.floor(day.day.mintemp_f),
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
        title: new Date(day.date).toLocaleDateString(undefined, { weekday: 'long' })
    }));

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