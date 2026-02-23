import styles from './Title.module.css'

export default function Title({ title }: { title: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.divider} />
    </div>
  )
}