import styles from './Title.module.css'

export default function Title({ title }: { title: string }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.divider} />
    </div>
  )
}