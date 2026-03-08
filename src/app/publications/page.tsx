import { Suspense } from 'react';
import publications from '../../../public/data/publications.json';
import PublicationList from './PublicationList';
import styles from './Publication.module.css';
import Title from '@/components/Title';
import FadeIn from '@/components/FadeIn';

export default function PublicationsPage() {
  return (
    <main className={styles.main}>
      <FadeIn>
        <Title title="Publications" />
      </FadeIn>
      <FadeIn>
        <Suspense>
          <PublicationList publications={publications} />
        </Suspense>
      </FadeIn>
    </main>
  );
}
