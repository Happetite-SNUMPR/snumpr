import publications from '../../../public/data/publications.json';
import PublicationList from './PublicationList';
import styles from './Publication.module.css';

export default function PublicationsPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.mainTitle}>Publications</h1>
      <PublicationList publications={publications} />
    </main>
  );
}
