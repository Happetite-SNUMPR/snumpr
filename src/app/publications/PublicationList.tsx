'use client';

import { PublicationItem } from '@/types';
import styles from './Publication.module.css';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { useMemo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PublicationListProps {
  publications: PublicationItem[];
}

export default function PublicationList({ publications }: PublicationListProps) {
  const { filters, setFilters } = usePublicationFilters();

  const options = useMemo(() => {
    return findPossibleOptions(publications);
  }, [publications]);

  const filteredPublications = useMemo(() => {
    return filterPublications(publications, filters).reduce<Record<string, PublicationItem[]>>(
      (acc, pub) => {
        const year = pub.year;
        if (!acc[year]) acc[year] = [];
        acc[year].push(pub);
        return acc;
      },
      {},
    );
  }, [publications, filters]);
  const sortedGroups = Object.entries(filteredPublications).sort((a, b) => {
    return b[0].localeCompare(a[0]);
  });

  return (
    <div className={styles.container}>
      <section className={styles.years}>
        <YearAnchors options={options} />
      </section>
      <section className={styles.publications}>
        <PublicationFilterController
          options={options}
          filters={filters}
          setFilters={setFilters}
        />
        <FilteredList signature={JSON.stringify(filters)}>
          {sortedGroups.map(([year, publications]) => (
            <section key={year} className={styles.pubYearSection}>
              <h2 className={styles.pubYearTitle} id={year}>
                {year}
              </h2>

              <div className={styles.pubYearList}>
                {publications.map((pub) => (
                  <PublicationItemView pub={pub} key={pub.title} />
                ))}
              </div>
            </section>
          ))}
        </FilteredList>
      </section>
    </div>
  );
}

const filterLabels = ['researchTopic', 'publicationType'] as const;
const publicationFiltersSchema = {
  publicationType: parseAsArrayOf(parseAsString).withDefault([]),
  researchTopic: parseAsArrayOf(parseAsString).withDefault([]),
};

type PublicationFilter = {
  [K in keyof typeof publicationFiltersSchema]: NonNullable<
    ReturnType<(typeof publicationFiltersSchema)[K]['parseServerSide']>
  >;
};
type PublicationFilterOptions = {
  [K in keyof typeof publicationFiltersSchema]: string[];
} & { year: string[] };

function filterPublications(
  publications: PublicationItem[],
  filters: PublicationFilter,
): PublicationItem[] {
  return publications.filter((pub) => {
    if (
      filters.publicationType.length > 0 &&
      !pub.publicationType.some((v) => filters.publicationType.includes(v))
    ) {
      return false;
    }
    if (
      filters.researchTopic.length > 0 &&
      !pub.researchTopic.some((v) => filters.researchTopic.includes(v))
    ) {
      return false;
    }
    return true;
  });
}

function findPossibleOptions(publications: PublicationItem[]) {
  const year = new Set<string>();
  const publicationType = new Set<string>();
  const researchTopic = new Set<string>();

  publications.forEach((pub) => {
    year.add(pub.year);
    pub.publicationType.forEach((v) => publicationType.add(v));
    pub.researchTopic.forEach((v) => researchTopic.add(v));
  });

  return {
    year: Array.from(year).sort().reverse(),
    publicationType: Array.from(publicationType).sort(),
    researchTopic: Array.from(researchTopic).sort(),
  };
}

function usePublicationFilters() {
  const [filters, setFilters] = useQueryStates(publicationFiltersSchema);
  return { filters, setFilters };
}

type PublicationFilterControllerProps = {
  options: PublicationFilterOptions;
  filters: PublicationFilter;
  setFilters: ReturnType<typeof usePublicationFilters>['setFilters'];
};

function YearAnchors({ options }: { options: PublicationFilterOptions }) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault(); // Prevent the harsh URL jump

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // Aligns the top of the element to the top of the viewport
      });

      // Optional: Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <>
      <div className={styles.yearsWrapper}>
        <span className={styles.yearTitle}>Year</span>
        <div className={styles.yearDetails}>
          {options['year'].map((o) => (
            <a
              key={o}
              href={`#${o}`}
              className={styles.yearLink}
              onClick={(e) => handleScroll(e, o)}
            >
              {o}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

function PublicationFilterController({
  options,
  filters,
  setFilters,
}: PublicationFilterControllerProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (filterName: (typeof filterLabels)[number], value: string) => {
    setFilters((prev) => {
      const current = prev[filterName];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterName]: next };
    });
  };

  const clearFilter = (filterName: (typeof filterLabels)[number]) => {
    setFilters((prev) => ({ ...prev, [filterName]: [] }));
  };

  const toggleDropdown = (label: string) => {
    setOpenFilter(openFilter === label ? null : label);
  };

  return (
    <div className={styles.filtersWrapper} ref={containerRef}>
      {filterLabels.map((l) => {
        const currentValues = filters[l];
        const isOpen = openFilter === l;
        const displayText = currentValues.length === 0 ? 'All' : currentValues.join(', ');

        return (
          <div key={l} className={styles.filterGroup}>
            <span className={styles.filterTitle}>{camelToTitle(l)}</span>

            <div className={styles.customSelectWrapper}>
              <div
                className={`${styles.filterDropdown} ${isOpen ? styles.active : ''}`}
                onClick={() => toggleDropdown(l)}
              >
                {displayText}
              </div>

              {isOpen && (
                <ul className={styles.optionsList}>
                  <li
                    className={`${styles.optionItem} ${currentValues.length === 0 ? styles.optionItemSelected : ''}`}
                    onClick={() => clearFilter(l)}
                  >
                    <span className={styles.optionLabel}>All</span>
                    {currentValues.length === 0 && <CheckIcon />}
                  </li>
                  {options[l].map((o) => {
                    const selected = currentValues.includes(o);
                    return (
                      <li
                        key={o}
                        className={`${styles.optionItem} ${selected ? styles.optionItemSelected : ''}`}
                        onClick={() => toggleOption(l, o)}
                      >
                        <span className={styles.optionLabel}>{o}</span>
                        {selected && <CheckIcon />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className={styles.optionCheck}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

function FilteredList({
  signature,
  children,
}: {
  signature: string;
  children: React.ReactNode;
}) {
  const [displayed, setDisplayed] = useState({ signature, children });
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (signature === displayed.signature) return;
    setPhase('out');
    const timeout = setTimeout(() => {
      setDisplayed({ signature, children });
      setPhase('in');
    }, 400);
    return () => clearTimeout(timeout);
  }, [signature, children, displayed.signature]);

  return (
    <div className={`${styles.filteredList} ${phase === 'out' ? styles.fadingOut : ''}`}>
      {displayed.children}
    </div>
  );
}

const MAX_VISIBLE_AUTHORS = 8;

function formatAuthors(authors: string[]): string {
  if (authors.length <= MAX_VISIBLE_AUTHORS) return authors.join(', ');
  return `${authors.slice(0, MAX_VISIBLE_AUTHORS).join(', ')}, et al.`;
}

function PublicationItemView({ pub }: { pub: PublicationItem }) {
  const authorsText = formatAuthors(pub.authors);
  const thumbnailUrl = pub.thumbnailUrl;
  return (
    <article className={styles.article}>
      <div className={styles.imageTitleWrapper}>
        <div className={styles.imageWrapper}>
          <Image
            src={thumbnailUrl}
            alt={pub.title}
            fill
            sizes="(max-width: 1024px) 9rem, 14rem"
            className={styles.image}
          />
        </div>
        <div className={styles.mobileDetailsWrapper}>
          <p className={styles.articleTitle}>{pub.title}</p>
          <p className={styles.authorsText}>{authorsText}</p>
          <p className={styles.journalsText}>{pub.journalsInfo}</p>
        </div>
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.detailsWrapper}>
          <p className={styles.articleTitle}>{pub.title}</p>
          <p className={styles.authorsText}>{authorsText}</p>
          <p className={styles.journalsText}>{pub.journalsInfo}</p>
        </div>
        <div className={styles.linksWrapper}>
          {pub.links.map(({ label, url }) => (
            <IconLink label={label} href={url} key={`${label}-${url}`} />
          ))}
        </div>
      </div>
    </article>
  );
}

function IconLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className={styles.iconLinkWrapper}>
      <Icon label={label} />
      <span className={styles.linkLabel}>{label}</span>
    </a>
  );
}

function Icon({ label }: { label: string }) {
  if (label.toLowerCase().startsWith('pdf')) {
    return <img src="/icons/publication/file.svg" alt={label} className={styles.icon} />;
  }
  return <img src="/icons/publication/globe.svg" alt={label} className={styles.icon} />;
}

/**
 * Converts a camelCase string to Title Case.
 * Example: "helloWorld" -> "Hello World"
 */
function camelToTitle(text: string): string {
  if (!text) return text;

  return (
    text
      // 1. Insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // 2. Capitalize the first letter and trim potential leading space
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
}
