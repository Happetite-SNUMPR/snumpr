'use client';

import { useState } from 'react';
import styles from './page.module.css';
import galleryData from '../../../public/data/gallery.json';
import { GalleryItem } from '../../types';
import Title from '../../components/Title';
import FadeIn from '../../components/FadeIn';

const gallery: GalleryItem[] = galleryData;

function GalleryCard({ item }: { item: GalleryItem }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < item.images.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <article className={styles.card}>
      <div className={styles.carouselWrapper}>
        <div
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {item.images.map((src, i) => (
            <div key={i} className={styles.carouselSlide}>
              <img
                src={src}
                alt={`${item.title} ${i + 1}`}
                className={styles.carouselImage}
                loading={i === 0 ? undefined : 'lazy'}
              />
            </div>
          ))}
        </div>

        {item.images.length > 1 && (
          <>
            <button
              className={styles.carouselArrow}
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous"
            >
              <img src="/icons/home/arrow.svg" alt="" />
            </button>
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
              onClick={handleNext}
              disabled={currentIndex === item.images.length - 1}
              aria-label="Next"
            >
              <img src="/icons/home/arrow.svg" alt="" style={{ transform: 'rotate(180deg)' }} />
            </button>
          </>
        )}

        <span className={styles.pageCounter}>
          {currentIndex + 1} / {item.images.length}
        </span>
      </div>

      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <span className={styles.categoryBadge}>{item.category}</span>
        <p className={styles.cardDescription}>{item.description}</p>
      </div>
    </article>
  );
}

export default function GalleryPage() {
  return (
    <main>
      <FadeIn>
        <div className={styles.container}>
          <Title title="Gallery" />
          <div className={styles.grid}>
            {gallery.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
