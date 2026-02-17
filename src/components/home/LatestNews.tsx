"use client";

import { useState } from "react";
import type { NewsItem } from "@/types";
import shared from "./shared.module.css";
import styles from "./LatestNews.module.css";

interface LatestNewsProps {
  news: NewsItem[];
}

export default function LatestNews({ news }: LatestNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < news.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!news || news.length === 0) return null;

  return (
    <section className={shared.section}>
      <div className={styles.controls}>
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === news.length - 1}
        >
          Next
        </button>
      </div>

      <h2 className={shared.sectionTitle}>Latest News</h2>

      <div className={styles.sliderContainer}>
        <div
          className={styles.sliderTrack}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {news.map((item) => (
            <div key={item.id} className={styles.slideItem}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={shared.image}
                />
              </div>
              <div className={shared.info}>
                <h3 className={shared.title}>{item.title}</h3>
                <p className={shared.details}>{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
