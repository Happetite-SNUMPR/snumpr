import Hero from '@/components/home/Hero';
import LatestNews from '@/components/home/LatestNews';
import Highlights from '@/components/home/Highlights';
import type { NewsItem, HighlightItem } from '@/types';

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'News Title',
    details: 'News details',
    imageUrl: 'https://picsum.photos/seed/news1/1200/800',
  },
  {
    id: '2',
    title: 'News Title 2',
    details: 'News details 2',
    imageUrl: 'https://picsum.photos/seed/news2/1200/800',
  },
];

const MOCK_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'h1',
    title: 'Highlight 1',
    details: 'News details',
    imageUrl: 'https://picsum.photos/seed/high1/1200/800',
  },
  {
    id: 'h2',
    title: 'Highlight 2',
    details: 'News details',
    imageUrl: 'https://picsum.photos/seed/high2/1200/800',
  },
  {
    id: 'h3',
    title: 'Highlight 3',
    details: 'News details',
    imageUrl: 'https://picsum.photos/seed/high3/1200/800',
  },
  {
    id: 'h4',
    title: 'Highlight 4',
    details: 'News details',
    imageUrl: 'https://picsum.photos/seed/high4/1200/800',
  },
  {
    id: 'h5',
    title: 'Highlight 5',
    details: 'News details',
    imageUrl: 'https://picsum.photos/seed/high5/1200/800',
  },
];

export default function Home() {
  return (
    <main>
      <Hero />
      <LatestNews news={MOCK_NEWS} />
      <Highlights highlights={MOCK_HIGHLIGHTS} />
    </main>
  );
}
