import { config } from '../config.js';

export interface NewsItem {
  title: string;
  url: string;
  content: string;
  publishedDate: string;
  score: number;
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  raw_content?: string;
  published_date?: string;
  score: number;
}

interface TavilyResponse {
  results: TavilyResult[];
}

export async function fetchNews(
  topics: string[],
  limit: number
): Promise<NewsItem[]> {
  const allResults: NewsItem[] = [];

  for (const topic of topics) {
    const results = await searchTavily(topic);
    allResults.push(...results);
  }

  // Дедупликация по URL и сортировка по score
  const uniqueByUrl = new Map<string, NewsItem>();
  for (const item of allResults) {
    if (!uniqueByUrl.has(item.url) || uniqueByUrl.get(item.url)!.score < item.score) {
      uniqueByUrl.set(item.url, item);
    }
  }

  return Array.from(uniqueByUrl.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function searchTavily(query: string): Promise<NewsItem[]> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: config.tavilyApiKey,
      query,
      search_depth: 'advanced',
      topic: 'news',
      days: 1,
      max_results: 10,
      include_raw_content: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as TavilyResponse;

  return data.results.map((r) => ({
    title: r.title,
    url: r.url,
    content: r.raw_content || r.content,
    publishedDate: r.published_date || new Date().toISOString().split('T')[0],
    score: r.score,
  }));
}
