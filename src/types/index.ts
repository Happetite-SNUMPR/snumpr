export interface NewsItem {
  id: string;
  title: string;
  details: string;
  imageUrl: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  details: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  images: string[];
}

export interface PublicationItem {
  title: string;
  authors: string[];
  journalsInfo: string;
  thumbnailUrl: string;
  links: { label: string; url: string }[];
  researchTopic: string[];
  year: string;
  publicationType: string[];
  recognized: string;
}
