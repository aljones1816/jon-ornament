export async function GET(request) {
  const datePieces = new Date()
    .toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/");

  const date = `${datePieces[2]}${datePieces[0]}${datePieces[1]}`;

  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${date}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch scores data" }),
      {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const data = await response.json();

  const games = data.events.map((event) => ({
    date: event.date,
    competitors: event.competitions[0].competitors.map((team) => ({
      name: team.team.displayName,
      score: team.score,
      logo: team.team.logo,
    })),
  }));

  return new Response(
    JSON.stringify({ games, timestamp: new Date().toLocaleTimeString() }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
