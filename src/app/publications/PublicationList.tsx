'use client';

import { PublicationItem } from '@/types';
import styles from './Publication.module.css';
import Image from 'next/image';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { useMemo } from 'react';

interface PublicationListProps {
  publications: PublicationItem[];
}

interface PublicationItemWithCited extends PublicationItem {
  cited?: number;
}

export default function PublicationList({ publications }: PublicationListProps) {
  const { filters, setFilters } = usePublicationFilters();

  const options = useMemo(() => {
    const datedYears = new Set<string>();
    const authors = new Set<string>();
    const tags = new Set<string>();

    publications.forEach((pub) => {
      datedYears.add(pub.datedYear.toString());
      pub.authors.forEach((author) => authors.add(author));
      pub.tags.forEach((tag) => tags.add(tag));
    });

    return {
      datedYears: Array.from(datedYears).sort().reverse(),
      authors: Array.from(authors).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [publications]);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      // Filter by Years (Exact match in array)
      if (
        filters.datedYears.length !== 0 &&
        !filters.datedYears.includes(pub.datedYear.toString())
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

const filterLabels = ['datedYears', 'authors', 'tags'] as const;
const publicationFiltersSchema = {
  datedYears: parseAsArrayOf(parseAsString).withDefault([]),
  authors: parseAsArrayOf(parseAsString).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
};

type PublicationFilterOptions = {
  [K in keyof typeof publicationFiltersSchema]: ReturnType<
    (typeof publicationFiltersSchema)[K]['parseServerSide']
  >;
};

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
          <Image src="filter.svg" alt="filter" width={32} height={32} />
          <span className={styles.filtersTitle}>Filters</span>
        </div>
        <p className={styles.resultsText}>{countResults} Results</p>
      </div>
      <div className={styles.filtersWrapper}>
        {filterLabels.map((l) => (
          <details key={l}>
            <summary className={styles.summary}>{l}</summary>
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

function PublicationItemView({ pub }: { pub: PublicationItemWithCited }) {
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
    return <Image src="file.svg" alt={label} width={16} height={16} />;
  }
  return <Image src="globe.svg" alt={label} width={16} height={16} />;
}
