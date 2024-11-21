import WeatherDisplay from './weather/WeatherDisplay';
import ScoresDisplay from './scores/ScoresDisplay';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <WeatherDisplay />
      <ScoresDisplay />
    </div>
  );
}
