import Title from '@/components/Title';
import joinUsData from '../../../public/data/join-us.json';
import styles from './page.module.css';
import { FormIcon } from '@/components/Icons';

export default function JoinUsPage() {
  return (
    <main className={styles.pageContainer}>
      <Title title={joinUsData.titleSection.title} />

      <section className={styles.section}>
        <p className={styles.heroDescription}>{joinUsData.titleSection.description}</p>
        <div className={styles.imageWrapper}>
          <img
            src={joinUsData.titleSection.featuredImage.imageUrl}
            alt={joinUsData.titleSection.featuredImage.caption}
            className={styles.image}
          />
          <div className={styles.captionArea}>
            <span className={styles.caption}>
              {joinUsData.titleSection.featuredImage.caption}
            </span>
            <span className={styles.date}>{joinUsData.titleSection.featuredImage.date}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{joinUsData.teamInterestSection.title}</h2>
        <p className={styles.description}>{joinUsData.teamInterestSection.description}</p>
      </section>

      <section className={styles.section}>
        <div className={styles.infoContainer}>
          {joinUsData.infoBlocks.map((block) => (
            <div key={block.id} className={styles.infoRow}>
              <h3 className={styles.infoTitle}>{block.title}</h3>
              <p className={styles.infoContent}>{block.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{joinUsData.researchSection.title}</h2>
        <div className={styles.researchGrid}>
          {joinUsData.researchSection.topics.map((topic) => (
            <article key={topic.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{topic.title}</h3>
              <p className={styles.cardDesc}>{topic.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{joinUsData.howToJoinSection.title}</h2>
        <p className={styles.description}>{joinUsData.howToJoinSection.description}</p>
        <a
          href={joinUsData.howToJoinSection.googleFormUrl}
          className={styles.linkButton}
          target="_blank"
          rel="noreferrer"
        >
          <FormIcon className={styles.formIcon} />
          Google Form Link
        </a>
      </section>
    </main>
  );
}
