import HomePage from "./home/page"
import styles from "./main.module.scss";

export default function Home() {
  return (
    <div className={styles.root}>
        <HomePage />
    </div>
  );
}
