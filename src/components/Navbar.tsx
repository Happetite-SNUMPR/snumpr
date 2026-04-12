'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { GithubIcon, HuggingFaceIcon } from './Icons';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State for menu toggle

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <Link href="/" className={styles.logoWrapper}>
          <Image
            src="/SNUMPR logo horizontal.svg"
            className={styles.logo}
            alt="snumpr lab"
            width={300}
            height={17}
          />
        </Link>

        {/* Hamburger Button - Only visible on mobile via CSS */}
        <button
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={styles.icons}>
          <a href="https://github.com/snumprlab" target="_blank" rel="noopener noreferrer">
            <GithubIcon className={styles.icon} />
          </a>
          <a href="https://huggingface.co/SNUMPR" target="_blank" rel="noopener noreferrer">
            <HuggingFaceIcon className={styles.icon} />
          </a>
        </div>
      </div>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`} onClick={closeMenu}>
        <Link href="/team" style={{ color: pathname === '/team' ? '#3928C8' : undefined }}>
          Team
        </Link>
        <Link
          href="/publications"
          style={{ color: pathname === '/publications' ? '#3928C8' : undefined }}
        >
          Publications
        </Link>
        <Link
          href="/gallery"
          style={{ color: pathname === '/gallery' ? '#3928C8' : undefined }}
        >
          Gallery
        </Link>
        <Link
          href="/join-us"
          style={{ color: pathname === '/join-us' ? '#3928C8' : undefined }}
        >
          Join Us
        </Link>
      </nav>

      {isOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </header>
  );
}
