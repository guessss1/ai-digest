---
paths:
  - src/content/blog/**/*.md
  - src/content/blog/**/*.mdx
---

# Article Style

## Format

```markdown
---
title: 'Заголовок статьи'
description: 'Краткое описание в 2–3 предложения.'
pubDate: '2026-03-25'
heroImage: './YYYY-MM-DD-slug.webp'
tags: ['llm', 'anthropic']
source: 'https://example.com/original-article'
---

Текст статьи. 300–500 слов.
```

## Digest Pipeline

- Формат статьи: 3–5 новостей, 100–150 слов каждая.
- Критерии отбора: AI/ML тематика, вышло за последнюю неделю, практическая ценность для разработчиков.
- Редполитика: разговорный тон, без маркетинга, без оценочных суждений.
- Файлы статей: `src/content/blog/YYYY-MM-DD-digest.md`.
- Обложка: 1200x630, минималистичный стиль. Кладётся **рядом со статьёй** (`src/content/blog/YYYY-MM-DD-slug.webp`), в frontmatter указывается полем `heroImage: './YYYY-MM-DD-slug.webp'`. Не использовать `cover:` и папку `public/covers/` — schema (`src/content.config.ts`) и шаблон `BlogPost.astro` не знают про них.
