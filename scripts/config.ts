import 'dotenv/config';

export const config = {
  // Темы для поиска новостей
  topics: [
    'Claude Code AI coding assistant',
    'GitHub Copilot updates',
    'Cursor AI IDE',
    'AI code generation tools',
    'LLM for developers',
  ],

  // Количество статей за один запуск
  articlesPerRun: 5,

  // Длина статьи в словах
  articleLength: { min: 300, max: 500 },

  // Модель для генерации изображений
  imageModel: 'black-forest-labs/flux-schnell',
  imageSize: { width: 1200, height: 630 },

  // Автопубликация (true = коммит в master, false = создание PR)
  autoPublish: true,

  // Пути
  outputDir: 'src/content/blog',
  assetsDir: 'src/assets/blog',
  dedupFile: 'data/published-urls.json',

  // API ключи (из .env)
  tavilyApiKey: process.env.TAVILY_API_KEY || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  replicateToken: process.env.REPLICATE_API_TOKEN || '',
};

export function validateConfig(): void {
  const missing: string[] = [];

  if (!config.tavilyApiKey) missing.push('TAVILY_API_KEY');
  if (!config.anthropicApiKey) missing.push('ANTHROPIC_API_KEY');
  if (!config.replicateToken) missing.push('REPLICATE_API_TOKEN');

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}
