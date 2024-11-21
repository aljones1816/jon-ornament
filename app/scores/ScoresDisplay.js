import React from 'react';
import styles from '../../styles/Scores.module.css';
import Image from 'next/image';

export default async function ScoresDisplay() {
    const date = '20241117'; // Replace with dynamic date if needed
    const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${date}`,
        { cache: 'no-store' }
    );

    if (!response.ok) {
        return <p>Failed to load sports scores.</p>;
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

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>NFL Scores</h2>
            {games.map((game, index) => (
                <div key={index} className={styles.game}>
                    <p className={styles.date}>{new Date(game.date).toLocaleString()}</p>
                    {game.competitors.map((team, i) => (
                        <div key={i} className={styles.team}>
                            <Image src={team.logo} alt={`${team.name} logo`} className={styles.logo} />
                            <p className={styles.name}>{team.name}</p>
                            <p className={styles.score}>{team.score}</p>
                        </div>
                    ))}
                    <hr className={styles.separator} />
                </div>
            ))}
        </div>
    );
}
