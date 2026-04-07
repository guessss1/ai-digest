import Replicate from 'replicate';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { config } from '../config.js';
import type { Article } from './writer.js';

const replicate = new Replicate({ auth: config.replicateToken });

export async function generateCover(article: Article, slug: string): Promise<string> {
  const prompt = buildImagePrompt(article.title);

  const output = await replicate.run(config.imageModel, {
    input: {
      prompt,
      aspect_ratio: '16:9',
      output_format: 'webp',
      output_quality: 90,
    },
  });

  // Replicate возвращает URL изображения или массив URL
  const imageUrl = Array.isArray(output) ? output[0] : output;

  if (typeof imageUrl !== 'string') {
    throw new Error('Unexpected Replicate output format');
  }

  // Скачиваем изображение
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  // Сохраняем в assets
  const filename = `${slug}.webp`;
  const filepath = join(config.assetsDir, filename);

  await mkdir(dirname(filepath), { recursive: true });
  await writeFile(filepath, buffer);

  return filepath;
}

function buildImagePrompt(title: string): string {
  // Генерируем абстрактный tech-промпт на основе заголовка
  const keywords = extractKeywords(title);

  return `Abstract digital art, technology concept, ${keywords.join(', ')}, futuristic, minimalist, blue and purple gradient, geometric shapes, neural network visualization, clean design, professional, modern, no text, no logos`;
}

function extractKeywords(title: string): string[] {
  const techTerms: Record<string, string> = {
    'claude': 'AI assistant',
    'gpt': 'language model',
    'copilot': 'code generation',
    'cursor': 'IDE interface',
    'llm': 'neural network',
    'ai': 'artificial intelligence',
    'код': 'programming',
    'code': 'programming',
    'api': 'data flow',
    'модел': 'machine learning',
    'model': 'machine learning',
  };

  const found: string[] = [];
  const lowerTitle = title.toLowerCase();

  for (const [term, visual] of Object.entries(techTerms)) {
    if (lowerTitle.includes(term)) {
      found.push(visual);
    }
  }

  return found.length > 0 ? found : ['technology', 'innovation'];
}
