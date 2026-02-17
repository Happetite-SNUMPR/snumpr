import type { HighlightItem } from "@/types";
import shared from "./shared.module.css";
import styles from "./Highlights.module.css";

interface HighlightsProps {
  highlights: HighlightItem[];
}

export default function Highlights({ highlights }: HighlightsProps) {
  return (
    <section className={`${shared.section} ${styles.section}`}>
      <h2 className={shared.sectionTitle}>Highlights</h2>
      <div className={styles.grid}>
        {highlights.map((item) => (
          <article key={item.id} className={styles.card}>
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
          </article>
        ))}
      </div>
    </section>
  );
}
