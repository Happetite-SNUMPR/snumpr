import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>snumpr lab.</div>
        <p className={styles.labName}>
          Seoul National University
          <br />
          Machine Perception and
          <br />
          Reasoning Laboratory
        </p>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.infoBlock}>
          <h4 className={styles.infoTitle}>Address</h4>
          <p className={styles.infoText}>
            1 Gwanak-ro, Gwanak-gu, Seoul
            <br />
            08826, South Korea
          </p>
        </div>
        <div className={styles.officeRow}>
          <div className={styles.infoBlock}>
            <h4 className={styles.infoTitle}>Office 1</h4>
            <p className={styles.infoText}>
              Engineering Building 2<br />
              (302) 510-2
            </p>
          </div>
          <div className={styles.infoBlock}>
            <h4 className={styles.infoTitle}>Office 2</h4>
            <p className={styles.infoText}>ASRI (133) 411/412</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
