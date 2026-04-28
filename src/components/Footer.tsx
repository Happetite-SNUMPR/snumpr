import Image from 'next/image';
import styles from './Footer.module.css';
import links from '../../public/data/links.json';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        <Image
          src="/logo.svg"
          alt="snumpr lab"
          className={styles.logo}
          width={500}
          height={100}
        />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.infoRow}>
          <div className={styles.infoBlock}>
            <h4 className={styles.infoTitle}>Address</h4>
            <p className={styles.infoText}>
              1 Gwanak-ro, Gwanak-gu, Seoul
              <br />
              08826, South Korea
            </p>
          </div>
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
        <div className={styles.snsRow}>
          {[
            { name: 'x', src: '/icons/sns/x.svg', href: links.sns.x },
            { name: 'bluesky', src: '/icons/sns/bluesky.svg', href: links.sns.bluesky },
            { name: 'instagram', src: '/icons/sns/instagram.svg', href: links.sns.instagram },
            { name: 'linkedin', src: '/icons/sns/linkedin.svg', href: links.sns.linkedin },
            { name: 'facebook', src: '/icons/sns/facebook.svg', href: links.sns.facebook },
          ].map((sns) => (
            <a key={sns.name} href={sns.href} className={styles.snsLink} aria-label={sns.name}>
              <Image
                src={sns.src}
                alt={sns.name}
                width={20}
                height={20}
                className={styles.snsIcon}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
