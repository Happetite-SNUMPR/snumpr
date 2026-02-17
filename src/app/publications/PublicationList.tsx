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
    <>
      <section>
        <PublicationFilterController
          options={options}
          filters={filters}
          setFilters={setFilters}
        />
      </section>
      <section className={styles.section}>
        {filteredPublications.map((pub) => (
          <PublicationItemView pub={pub} key={pub.title} />
        ))}
      </section>
    </>
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
};

function PublicationFilterController({
  options,
  filters,
  setFilters,
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

  const a = filters as PublicationFilterOptions;
  return (
    <div>
      <p>
        <Image src="filter.svg" alt="filter" width={16} height={16} /> Filters
      </p>
      {filterLabels.map((l) => (
        <div key={l}>
          {l}
          {options[l].map((o) => (
            <label key={`${l}-${o}`}>
              <input
                type="checkbox"
                name={o}
                checked={(filters as PublicationFilterOptions)[l].includes(o)}
                onChange={handleChange(l)}
              />
              {o}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

function PublicationItemView({ pub }: { pub: PublicationItemWithCited }) {
  return (
    <article className={styles.article}>
      <img src={pub.thumbnailUrl} className={styles.image} />
      <div className={styles.infoWrapper}>
        <p className={styles.articleTitle}>{pub.title}</p>
        <div className={styles.detailsWrapper}>
          <p className={styles.details}>{pub.authors.join(', ')}</p>
          <p className={styles.details}>{pub.journalsInfo}</p>
        </div>
      </div>
      <aside className={styles.aside}>
        {pub.links.map(({ label, url }) => (
          <IconLink label={label} href={url} key={`${label}-${url}`} />
        ))}
      </aside>
    </article>
  );
}

function IconLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className={styles.iconLinkWrapper}>
      <Icon label={label} />
      <span className={styles.details}>{label}</span>
    </a>
  );
}

function Icon({ label }: { label: string }) {
  if (label.toLowerCase().startsWith('pdf')) {
    return <Image src="file.svg" alt={label} width={16} height={16} />;
  }
  return <Image src="globe.svg" alt={label} width={16} height={16} />;
}
