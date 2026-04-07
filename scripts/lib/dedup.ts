import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { config } from '../config.js';
import type { NewsItem } from './fetcher.js';

interface DedupCache {
  urls: string[];
  lastUpdated: string | null;
}

async function loadCache(): Promise<DedupCache> {
  try {
    const content = await readFile(config.dedupFile, 'utf-8');
    return JSON.parse(content) as DedupCache;
  } catch {
    return { urls: [], lastUpdated: null };
  }
}

async function saveCache(cache: DedupCache): Promise<void> {
  await mkdir(dirname(config.dedupFile), { recursive: true });
  await writeFile(config.dedupFile, JSON.stringify(cache, null, 2));
}

export async function filterNewItems(items: NewsItem[]): Promise<NewsItem[]> {
  const cache = await loadCache();
  const publishedUrls = new Set(cache.urls);

  return items.filter((item) => !publishedUrls.has(item.url));
}

export async function markAsPublished(urls: string[]): Promise<void> {
  const cache = await loadCache();

  // Добавляем новые URL
  const updatedUrls = new Set(cache.urls);
  for (const url of urls) {
    updatedUrls.add(url);
  }

  // Ограничиваем размер кэша (последние 1000 URL)
  const urlsArray = Array.from(updatedUrls);
  const trimmedUrls = urlsArray.slice(-1000);

  await saveCache({
    urls: trimmedUrls,
    lastUpdated: new Date().toISOString(),
  });
}
