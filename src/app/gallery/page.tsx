'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import galleryData from '../../../public/data/gallery.json';
import { GalleryItem } from '../../types';
import Title from '../../components/Title';
import FadeIn from '../../components/FadeIn';

const gallery: GalleryItem[] = galleryData;

function GalleryCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < item.images.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <article className={styles.card} onClick={onClick} style={{ cursor: 'pointer' }}>
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

function GalleryModal({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < item.images.length - 1) setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, item.images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.modalImageArea}>
          <div
            className={styles.modalImageTrack}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {item.images.map((src, i) => (
              <div key={i} className={styles.modalImageSlide}>
                <img
                  src={src}
                  alt={`${item.title} ${i + 1}`}
                  className={styles.modalImage}
                  loading={i === 0 ? undefined : 'lazy'}
                />
              </div>
            ))}
          </div>

          {item.images.length > 1 && (
            <>
              <button
                className={styles.modalArrow}
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Previous"
              >
                <img src="/icons/home/arrow.svg" alt="" />
              </button>
              <button
                className={`${styles.modalArrow} ${styles.modalArrowRight}`}
                onClick={handleNext}
                disabled={currentIndex === item.images.length - 1}
                aria-label="Next"
              >
                <img src="/icons/home/arrow.svg" alt="" style={{ transform: 'rotate(180deg)' }} />
              </button>
            </>
          )}

          <span className={styles.modalPageCounter}>
            {currentIndex + 1} / {item.images.length}
          </span>
        </div>

        <div className={styles.modalInfo}>
          <h2 className={styles.modalTitle}>{item.title}</h2>
          <p className={styles.modalDate}>{item.date}</p>

          <span className={styles.modalLabel}>DESCRIPTION</span>
          <p className={styles.modalDescription}>{item.description}</p>

          {item.location && (
            <p className={styles.modalLocation}>Location: {item.location}</p>
          )}

          {item.images.length > 1 && (
            <>
              <span className={styles.modalLabel}>IMAGES</span>
              <div className={styles.thumbnailStrip}>
                {item.images.map((src, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbnail} ${i === currentIndex ? styles.thumbnailActive : ''}`}
                    onClick={() => setCurrentIndex(i)}
                  >
                    <img src={src} alt={`${item.title} thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <main>
      <FadeIn>
        <div className={styles.container}>
          <Title title="Gallery" />
          <div className={styles.grid}>
            {gallery.map((item) => (
              <GalleryCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        </div>
      </FadeIn>

      {selectedItem && (
        <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </main>
  );
}
