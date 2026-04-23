const H1_PREFIX = '# ';
const PARAGRAPH_SEPARATOR = '\n\n';

export interface Article {
  title: string;
  description: string;
}

export function parseArticle(markdown: string): Article {
  const [heading, description] = markdown.split(PARAGRAPH_SEPARATOR);
  const title = heading.slice(H1_PREFIX.length);

  return { title, description };
}
