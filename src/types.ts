export interface Post {
  id: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
    date: string;
    description: string;
    body: string;
    tags: string[];
  };
}

export type ReviewType =
  | "Game"
  | "TV Series"
  | "Movie"
  | "Article"
  | "Book"
  | "Music";

export interface Review {
  id: string;
  html: string;
  excerpt: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    type: ReviewType;
    name: string;
    title: string;
    date: string;
    stars: number;
    link: string;
    image: string;
  };
}
