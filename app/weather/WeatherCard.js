import React from 'react';
import styles from '../../styles/Weather.module.css';

export default function WeatherCard({ title, temp, condition, icon }) {
    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>{title}</h2>
            <img src={icon} alt={condition} className={styles.cardIcon} />
            <p className={styles.cardTemp}>{temp}</p>
            <p className={styles.cardCondition}>{condition}</p>
        </div>
    );
}
