import styles from './LoadingScreen.module.css'

export default function LoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <span className={styles.emoji}>🌍⚽</span>
      </div>
      <p className={styles.text}>Cargando NA-ONTOUR...</p>
    </div>
  )
}
