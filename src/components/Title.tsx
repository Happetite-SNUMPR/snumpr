import styles from './Title.module.css';

export default function Title({ title }: { title: string }) {
  return <div className={styles.container} aria-label={title} />;
}
