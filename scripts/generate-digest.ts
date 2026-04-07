import { config, validateConfig } from './config.js';
import { fetchNews } from './lib/fetcher.js';
import { filterNewItems, markAsPublished } from './lib/dedup.js';
import { writeArticle } from './lib/writer.js';
import { generateCover } from './lib/image-gen.js';
import {
  createSlug,
  writeArticleFile,
  createBranch,
  commitAndPush,
  createPR,
  type ArticleFile,
} from './lib/publisher.js';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function log(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function main(): Promise<void> {
  log('Starting AI Digest generation...');

  // Валидация конфига
  validateConfig();
  log('Config validated');

  const date = today();

  // 1. Получить новости
  log(`Fetching news for topics: ${config.topics.join(', ')}`);
  const news = await fetchNews(config.topics, 20);
  log(`Found ${news.length} news items`);

  if (news.length === 0) {
    log('No news found. Exiting.');
    return;
  }

  // 2. Фильтрация дубликатов
  const newItems = await filterNewItems(news);
  log(`After deduplication: ${newItems.length} new items`);

  if (newItems.length === 0) {
    log('All news already published. Exiting.');
    return;
  }

  // 3. Выбрать топ-N
  const selected = newItems.slice(0, config.articlesPerRun);
  log(`Selected ${selected.length} items for processing`);

  // 4. Сгенерировать статьи
  log('Generating articles...');
  const articles: ArticleFile[] = [];

  for (const item of selected) {
    try {
      log(`  Writing article for: ${item.title}`);
      const article = await writeArticle(item);
      const slug = createSlug(article.title, date);
      articles.push({ slug, article });
    } catch (error) {
      log(`  Error writing article: ${error}`);
    }
  }

  if (articles.length === 0) {
    log('No articles generated. Exiting.');
    return;
  }

  // 5. Сгенерировать обложки
  log('Generating cover images...');
  for (const file of articles) {
    try {
      log(`  Generating cover for: ${file.article.title}`);
      file.imagePath = await generateCover(file.article, file.slug);
    } catch (error) {
      log(`  Error generating cover: ${error}`);
      // Продолжаем без обложки
    }
  }

  // 6. Создать ветку
  log(`Creating branch digest/${date}...`);
  const branch = await createBranch(date);

  // 7. Записать файлы статей
  log('Writing article files...');
  for (const file of articles) {
    const filepath = await writeArticleFile(file, date);
    log(`  Written: ${filepath}`);
  }

  // 8. Коммит и пуш
  log('Committing and pushing...');
  await commitAndPush(branch, articles, date);

  // 9. Создать PR
  log('Creating PR...');
  const prUrl = await createPR(branch, date, articles);
  log(`PR created: ${prUrl}`);

  // 10. Обновить кэш дедупликации
  await markAsPublished(selected.map((n) => n.url));
  log('Deduplication cache updated');

  log('Done!');
  console.log(`\n✅ Created PR with ${articles.length} articles: ${prUrl}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
