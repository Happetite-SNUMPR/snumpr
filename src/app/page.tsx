'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import newsData from '../../public/data/news.json';
import highlightsData from '../../public/data/highlights.json';
import { NewsItem, HighlightItem } from '../types';
import FadeIn from '../components/FadeIn';

const news: NewsItem[] = newsData;
const highlights: HighlightItem[] = highlightsData;
const HIGHLIGHTS_PREVIEW_COUNT = 4;

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
                <img src="/icons/home/arrow.svg" alt="Previous" />
              </button>

              <div className={styles.sliderContainer}>
                <div
                  className={styles.sliderTrack}
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {news.map((item, idx) => (
                    <div key={item.id} className={styles.slideItem}>
                      <div className={styles.newsImageWrapper}>
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 900px) 100vw, 1280px"
                          className={styles.image}
                          priority={idx === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`${styles.arrowBtn} ${styles.arrowBtnRight}`}
                onClick={handleNext}
                aria-label="Next"
              >
                <img
                  src="/icons/home/arrow.svg"
                  alt="Next"
                  style={{ transform: 'rotate(180deg)' }}
                />
              </button>

              <div className={styles.dots} role="tablist" aria-label="News pagination">
                {news.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-selected={idx === currentIndex}
                    role="tab"
                  />
                ))}
              </div>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.info}>
                <h3 className={styles.title}>{news[currentIndex].title}</h3>
                <p className={styles.details}>{news[currentIndex].details}</p>
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* Highlights */}
      <FadeIn>
        <section className={`${styles.section} ${styles.highlightsSection}`}>
          <div className={styles.highlightsHeader}>
            <h2 className={styles.sectionTitle}>Highlights</h2>
            <Link href="/highlights" className={styles.seeAllLink}>
              <span className={styles.seeAllText}>See all</span>
              <svg
                className={styles.seeAllArrow}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="18" y2="12" />
                <polyline points="13,7 18,12 13,17" />
              </svg>
            </Link>
          </div>
          <div className={styles.highlightsGrid}>
            {highlights.slice(0, HIGHLIGHTS_PREVIEW_COUNT).map((item, idx) => (
              <article key={item.id} className={styles.highlightCard}>
                <div className={styles.highlightImageWrapper}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 900px) 50vw, 28rem"
                    className={styles.image}
                    priority={idx < 2}
                  />
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
