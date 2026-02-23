import publications from '../../../public/data/publications.json';
import PublicationList from './PublicationList';
import styles from './Publication.module.css';
import Title from '@/components/Title';

export default function PublicationsPage() {
  return (
    <main className={styles.main}>
      <Title title="Publications" />
      <PublicationList publications={publications} />
    </main>
  );
}
