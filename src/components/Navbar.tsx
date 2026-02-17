import Link from "next/link";
import styles from "./Navbar.module.css";
import { GithubIcon, HuggingFaceIcon } from "./Icons";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        snumpr lab
      </Link>

      <nav className={styles.nav}>
        <Link href="/team">Team</Link>
        <Link href="/publications">Publications</Link>
        <Link href="/join-us">Join Us</Link>

        <a
          href="https://github.com/snumprlab"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className={styles.icon} />
        </a>
        <a
          href="https://huggingface.co/SNUMPR"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HuggingFaceIcon className={`${styles.icon} ${styles.huggingFace}`} />
        </a>
      </nav>
    </header>
  );
}
