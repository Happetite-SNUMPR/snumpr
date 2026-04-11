'use client';

import { PublicationItem } from '@/types';
import styles from './Publication.module.css';
import { parseAsString, useQueryStates } from 'nuqs';
import { useMemo, useEffect, useRef, useState } from 'react';

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
      </section>
    </div>
  );
}

const filterLabels = ['researchTopic', 'publicationType'] as const;
const publicationFiltersSchema = {
  publicationType: parseAsString.withDefault(''),
  researchTopic: parseAsString.withDefault(''),
};

type PublicationFilter = {
  [K in keyof typeof publicationFiltersSchema]: ReturnType<
    (typeof publicationFiltersSchema)[K]['parseServerSide']
  >;
};
type PublicationFilterOptions = {
  [K in keyof typeof publicationFiltersSchema]: NonNullable<
    ReturnType<(typeof publicationFiltersSchema)[K]['parseServerSide']>
  >[];
} & { year: string[] };

function filterPublications(
  publications: PublicationItem[],
  filters: PublicationFilter,
): PublicationItem[] {
  return publications.filter((pub) => {
    if (
      filters.publicationType &&
      !pub.publicationType.some((v) => filters.publicationType === v)
    ) {
      return false;
    }
    if (
      filters.researchTopic &&
      !pub.researchTopic.some((researchTopic) => filters.researchTopic === researchTopic)
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

  const handleSelect = (filterName: keyof PublicationFilterOptions, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setOpenFilter(null); // Close after selection
  };

  const toggleDropdown = (label: string) => {
    setOpenFilter(openFilter === label ? null : label);
  };

  return (
    <div className={styles.filtersWrapper} ref={containerRef}>
      {filterLabels.map((l) => {
        const currentValue = (filters as any)[l] || '';
        const isOpen = openFilter === l;

        return (
          <div key={l} className={styles.filterGroup}>
            <span className={styles.filterTitle}>{camelToTitle(l)}</span>

            <div className={styles.customSelectWrapper}>
              <div
                className={`${styles.filterDropdown} ${isOpen ? styles.active : ''}`}
                onClick={() => toggleDropdown(l)}
              >
                {currentValue || 'All'}
              </div>

              {isOpen && (
                <ul className={styles.optionsList}>
                  <li className={styles.optionItem} onClick={() => handleSelect(l, '')}>
                    All
                  </li>
                  {options[l].map((o) => (
                    <li
                      key={o}
                      className={styles.optionItem}
                      onClick={() => handleSelect(l, o)}
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PublicationItemView({ pub }: { pub: PublicationItem }) {
  return (
    <article className={styles.article}>
      <div className={styles.imageTitleWrapper}>
        <div className={styles.imageWrapper}>
          <img src={pub.thumbnailUrl} className={styles.image} />
        </div>
        <p className={styles.articleTitle}>{pub.title}</p>
      </div>
      <div className={styles.infoWrapper}>
        <p className={styles.articleTitle}>{pub.title}</p>
        <div className={styles.detailsWrapper}>
          <p className={styles.authorsText}>{pub.authors.join(', ')}</p>
          <p className={styles.journalsText}>{pub.journalsInfo}</p>
          <div className={styles.linksWrapper}>
            {pub.links.map(({ label, url }) => (
              <IconLink label={label} href={url} key={`${label}-${url}`} />
            ))}
          </div>
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
