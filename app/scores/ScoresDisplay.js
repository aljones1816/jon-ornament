"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/Scores.module.css";
import Image from "next/image";

export default function ScoresDisplay() {
  // get today's date in eastern time in the format yyymmdd
  const datePieces = new Date()
    .toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/");

  const date = `${datePieces[2]}${datePieces[0]}${datePieces[1]}`;

  // State for games and the currently displayed game
  const [games, setGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Fetch games on component mount
  useEffect(() => {
    async function fetchGames() {
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${date}`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const fetchedGames = data.events.map((event) => ({
          date: event.date,
          competitors: event.competitions[0].competitors.map((team) => ({
            name: team.team.displayName,
            score: team.score,
            logo: team.team.logo,
          })),
        }));

        setGames(fetchedGames);
      }
    }

    fetchGames();
  }, []);

  // Cycle through games every 5 seconds
  useEffect(() => {
    if (games.length > 1) {
      const interval = setInterval(() => {
        setFade(false); // Start fade-out animation
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % games.length); // Move to the next game
          setFade(true); // Start fade-in animation
        }, 500); // Match the duration of the fade-out CSS animation
      }, 10000); // Show each game for 5 seconds

      return () => clearInterval(interval);
    }
  }, [games]);

  // Show a loading state while games are being fetched
  if (games.length === 0) {
    return <div className={styles.card}>Loading...</div>;
  }

  const currentGame = games[currentIndex];

  return (
    <div className={`${styles.card} ${fade ? styles.fadeIn : styles.fadeOut}`}>
      <h2 className={styles.title}>NFL Scores</h2>
      <div className={styles.game}>
        <p className={styles.date}>
          {new Date(currentGame.date).toLocaleString()}
        </p>
        {currentGame.competitors.map((team, i) => (
          <div key={i} className={styles.team}>
            <Image
              src={team.logo}
              alt={`${team.name} logo`}
              className={styles.logo}
              width={30}
              height={30}
            />
            <p className={styles.name}>{team.name}</p>
            <p className={styles.score}>{team.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
