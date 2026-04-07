import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';
import type { NewsItem } from './fetcher.js';

export interface Article {
  title: string;
  description: string;
  content: string;
  tags: string[];
  source: string;
}

const client = new Anthropic({ apiKey: config.anthropicApiKey });

const SYSTEM_PROMPT = `Ты — технический журналист AI Digest, русскоязычного издания о новостях AI и инструментах для разработчиков.

Твоя задача: на основе исходной новости написать информативную статью для блога.

Требования к статье:
- Заголовок: краткий, информативный, на русском языке
- Описание: 2-3 предложения, суть новости
- Контент: 300-500 слов, Markdown-форматирование
- Теги: 2-4 релевантных тега (llm, anthropic, openai, github, cursor, copilot, ai-coding и т.д.)

Структура контента:
1. Что произошло (факты)
2. Почему это важно (контекст)
3. Практическое значение (для разработчиков)

Стиль:
- Информативный, без воды
- Технически точный
- Без рекламных формулировок
- Факты важнее мнений`;

const USER_PROMPT_TEMPLATE = `Напиши статью на основе этой новости:

**Заголовок источника:** {title}
**URL источника:** {url}
**Содержание:**
{content}

Ответ дай строго в JSON-формате:
{
  "title": "Заголовок статьи на русском",
  "description": "Описание в 2-3 предложения",
  "content": "Markdown-контент статьи 300-500 слов",
  "tags": ["tag1", "tag2"]
}`;

export async function writeArticle(news: NewsItem): Promise<Article> {
  const userPrompt = USER_PROMPT_TEMPLATE
    .replace('{title}', news.title)
    .replace('{url}', news.url)
    .replace('{content}', truncateContent(news.content, 4000));

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      { role: 'user', content: userPrompt },
    ],
    system: SYSTEM_PROMPT,
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as Omit<Article, 'source'>;

  return {
    ...parsed,
    source: news.url,
  };
}

function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '...';
}
