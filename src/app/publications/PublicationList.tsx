'use client';

import { PublicationItem } from '@/types';
import styles from './Publication.module.css';
import Image from 'next/image';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { useMemo } from 'react';

interface PublicationListProps {
  publications: PublicationItem[];
}

export default function PublicationList({ publications }: PublicationListProps) {
  const { filters, setFilters } = usePublicationFilters();

  const options = useMemo(() => {
    return findPossibleOptions(publications);
  }, [publications]);

  const filteredPublications = useMemo(() => {
    return filterPublications(publications, filters);
  }, [publications, filters]);

  return (
    <div className={styles.container}>
      <section className={styles.filters}>
        <PublicationFilterController
          options={options}
          filters={filters}
          setFilters={setFilters}
          countResults={filteredPublications.length}
        />
      </section>
      <section className={styles.publications}>
        {filteredPublications.map((pub) => (
          <PublicationItemView pub={pub} key={pub.title} />
        ))}
      </section>
    </div>
  );
}

const filterLabels = ['recognized', 'year', 'venues', 'authors', 'tags'] as const;
const publicationFiltersSchema = {
  recognized: parseAsArrayOf(parseAsString).withDefault([]),
  year: parseAsArrayOf(parseAsString).withDefault([]),
  venues: parseAsArrayOf(parseAsString).withDefault([]),
  authors: parseAsArrayOf(parseAsString).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
};

type PublicationFilterOptions = {
  [K in keyof typeof publicationFiltersSchema]: ReturnType<
    (typeof publicationFiltersSchema)[K]['parseServerSide']
  >;
};

function filterPublications(
  publications: PublicationItem[],
  filters: PublicationFilterOptions,
): PublicationItem[] {
  return publications.filter((pub) => {
    // Filter by Recognized (Exact match in array)
    if (filters.recognized.length !== 0 && !filters.recognized.includes(pub.recognized)) {
      return false;
    }
    // Filter by Years (Exact match in array)
    if (filters.year.length !== 0 && !filters.year.includes(pub.year.toString())) {
      return false;
    }
    // Filter by Venues (Intersection)
    if (
      filters.venues.length !== 0 &&
      !pub.venues.some((author) => filters.venues.includes(author))
    ) {
      return false;
    }
    // Filter by Authors (Intersection)
    if (
      filters.authors.length !== 0 &&
      !pub.authors.some((author) => filters.authors.includes(author))
    ) {
      return false;
    }
    // Filter by Tags (Intersection)
    if (filters.tags.length !== 0 && !pub.tags.some((tag) => filters.tags.includes(tag))) {
      return false;
    }
    return true;
  });
}

function findPossibleOptions(publications: PublicationItem[]) {
  const recognized = new Set<string>();
  const year = new Set<string>();
  const venues = new Set<string>();
  const authors = new Set<string>();
  const tags = new Set<string>();

  publications.forEach((pub) => {
    recognized.add(pub.recognized);
    year.add(pub.year.toString());
    pub.venues.forEach((venue) => venues.add(venue));
    pub.authors.forEach((author) => authors.add(author));
    pub.tags.forEach((tag) => tags.add(tag));
  });

  return {
    recognized: Array.from(recognized).sort(),
    year: Array.from(year).sort().reverse(),
    venues: Array.from(venues).sort(),
    authors: Array.from(authors).sort(),
    tags: Array.from(tags).sort(),
  };
}

function usePublicationFilters() {
  const [filters, setFilters] = useQueryStates(publicationFiltersSchema);
  return { filters, setFilters };
}

type PublicationFilterControllerProps = {
  options: PublicationFilterOptions;
  filters: PublicationFilterOptions;
  setFilters: ReturnType<typeof usePublicationFilters>['setFilters'];
  countResults: number;
};

function PublicationFilterController({
  options,
  filters,
  setFilters,
  countResults,
}: PublicationFilterControllerProps) {
  const handleChange =
    (filterName: keyof PublicationFilterOptions) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = new Set(filters[filterName]);
      if (event.target.checked) {
        selected.add(event.target.name);
      } else {
        selected.delete(event.target.name);
      }
      setFilters({ [filterName]: Array.from(selected) });
    };

  return (
    <>
      <div className={styles.filtersTitleWrapper}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/icons/publication/filter.svg" alt="filter" width={32} height={32} />
          <span className={styles.filtersTitle}>Filters</span>
        </div>
        <p className={styles.resultsText}>{countResults} Results</p>
      </div>
      <div className={styles.filtersWrapper}>
        {filterLabels.map((l) => (
          <details key={l} open>
            <summary className={styles.summary}>{camelToTitle(l)}</summary>
            <div className={styles.details}>
              {options[l].map((o) => (
                <label key={`${l}-${o}`} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name={o}
                    checked={(filters as PublicationFilterOptions)[l].includes(o)}
                    onChange={handleChange(l)}
                    style={{ marginRight: '1.2rem' }}
                  />
                  {o}
                </label>
              ))}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}

function PublicationItemView({ pub }: { pub: PublicationItem }) {
  return (
    <article className={styles.article}>
      <img src={pub.thumbnailUrl} className={styles.image} />
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
    return <Image src="/icons/publication/file.svg" alt={label} width={16} height={16} />;
  }
  return <Image src="/icons/publication/globe.svg" alt={label} width={16} height={16} />;
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
