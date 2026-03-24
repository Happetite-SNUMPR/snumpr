'use client';

import { useState } from 'react';
import styles from './page.module.css';
import newsData from '../../public/data/news.json';
import highlightsData from '../../public/data/highlights.json';
import { NewsItem, HighlightItem } from '../types';
import FadeIn from '../components/FadeIn';

const news: NewsItem[] = newsData;
const highlights: HighlightItem[] = highlightsData;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  return (
    <main className={styles.main}>
      {/* Hero - commented out
      <FadeIn>
        <section className={styles.hero}>
          <img src="/images/hero.png" alt="" className={styles.bgImage} />
          <div className={styles.bgOverlay} />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              We study
              <br />
              <span className={styles.accent}>visual perception</span>
              <br />
              and <span className={styles.accent}>machine reasoning.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              We read, code, discuss and write about computer vision,
              <br />
              machine learning, natural language processing and robotics.
            </p>
          </div>
        </section>
      </FadeIn>
      */}

      {/* Latest News */}
      {news.length > 0 && (
        <FadeIn>
          <section className={`${styles.section} ${styles.newsSection}`}>
            <div className={styles.sliderArea}>
              <button className={styles.arrowBtn} onClick={handlePrev} aria-label="Previous">
                <img src="/icons/home/arrow.svg" alt="Previous" className={styles.arrowIcon} />
              </button>

              <div className={styles.sliderContainer}>
                <div
                  className={styles.sliderTrack}
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {news.map((item) => (
                    <div key={item.id} className={styles.slideItem}>
                      <div className={styles.newsImageWrapper}>
                        <img src={item.imageUrl} alt={item.title} className={styles.image} />
                      </div>
                      <div className={styles.info}>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.details}>{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className={styles.arrowBtn} onClick={handleNext} aria-label="Next">
                <img
                  src="/icons/home/arrow.svg"
                  alt="Next"
                  className={styles.arrowIcon}
                  style={{ transform: 'rotate(180deg)' }}
                />
              </button>
            </div>
          </section>
        </FadeIn>
      )}

      {/* Highlights */}
      <FadeIn>
        <section className={`${styles.section} ${styles.highlightsSection}`}>
          <h2 className={styles.sectionTitle}>Highlights</h2>
          <div className={styles.highlightsGrid}>
            {highlights.map((item) => (
              <article key={item.id} className={styles.highlightCard}>
                <div className={styles.highlightImageWrapper}>
                  <img src={item.imageUrl} alt={item.title} className={styles.image} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.details}>{item.details}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
