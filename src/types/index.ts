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

export interface PublicationItem {
  title: string;
  authors: string[];
  journalsInfo: string;
  thumbnailUrl: string;
  links: { label: string; url: string }[];
  tags: string[];
  datedYear: number;
}
