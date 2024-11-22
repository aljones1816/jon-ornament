export async function GET(request) {
  const WEATHERAPI_API_KEY = process.env.WEATHERAPI_API_KEY;

  if (!WEATHERAPI_API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?q=02139&key=${WEATHERAPI_API_KEY}&days=3`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch weather data" }),
      {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const data = await response.json();

  const today = {
    date: data.forecast.forecastday[0].date,
    temp: Math.floor(data.current.temp_f),
    high: Math.floor(data.forecast.forecastday[0].day.maxtemp_f),
    low: Math.floor(data.forecast.forecastday[0].day.mintemp_f),
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
    title: "Today",
  };

  const forecast = data.forecast.forecastday.slice(1).map((day) => ({
    date: day.date,
    high: Math.floor(day.day.maxtemp_f),
    low: Math.floor(day.day.mintemp_f),
    condition: day.day.condition.text,
    icon: day.day.condition.icon,
    title: new Date(day.date).toLocaleDateString(undefined, {
      weekday: "long",
    }),
  }));

  return new Response(JSON.stringify({ today, forecast }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
