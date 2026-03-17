import Link from 'next/link';
import styles from './Navbar.module.css';
import { GithubIcon, HuggingFaceIcon } from './Icons';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.svg" alt="snumpr lab" width={112} height={21} />
        </Link>

        <div className={styles.icons}>
          <a href="https://github.com/snumprlab" target="_blank" rel="noopener noreferrer">
            <GithubIcon className={styles.icon} />
          </a>
          <a href="https://huggingface.co/SNUMPR" target="_blank" rel="noopener noreferrer">
            <HuggingFaceIcon className={styles.icon} />
          </a>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link href="/team">Team</Link>
        <Link href="/publications">Publications</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/join-us">Join Us</Link>
      </nav>
    </header>
  );
}
