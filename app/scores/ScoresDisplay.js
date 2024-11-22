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
  const [timestamp, setTimestamp] = useState("");

  async function fetchGames() {
    try {
      const response = await fetch("/api/scores");
      if (!response.ok) throw new Error("Failed to fetch scores data");

      const data = await response.json();
      setGames(data.games);
      setTimestamp(data.timestamp);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 10 * 60 * 1000);
    return () => clearInterval(interval);
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
      <p className={styles.timestamp}>Last updated: {timestamp}</p>
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
