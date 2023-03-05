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
