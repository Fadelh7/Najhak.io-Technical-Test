import styles from './StatCards.module.css';

const StatCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>Total Requests</div>
        <div className={styles.statValue}>{stats.total}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>New</div>
        <div className={`${styles.statValue} ${styles.textBlue}`}>{stats.new}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>In Progress</div>
        <div className={`${styles.statValue} ${styles.textYellow}`}>{stats.inProgress}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>Done</div>
        <div className={`${styles.statValue} ${styles.textGreen}`}>{stats.done}</div>
      </div>
    </div>
  );
};

export default StatCards;
