import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        We study
        <br />
        visual perception
        <br />
        and machine
        <br />
        reasoning.
      </h1>
      <p className={styles.subtitle}>
        We read, code, discuss and write about computer vision, machine
        <br />
        learning, natural language processing and robotics.
      </p>
    </section>
  );
}
