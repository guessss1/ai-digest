# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Digest — автоматический дайджест новостей AI, машинного обучения и LLM. Построен на Astro 6 как статический сайт с MDX-контентом.

## Commands

```bash
npm run dev      # Dev-сервер на localhost:4321
npm run build    # Production-сборка
npm run preview  # Предпросмотр сборки
```

Node.js >= 22.12.0

## Architecture

**Content Layer** (`src/content/`):
- Статьи в `src/content/blog/` как `.md`/`.mdx` файлы
- Схема контента в `src/content.config.ts` (Zod-валидация frontmatter)
- Обязательные поля: `title`, `description`, `pubDate`
- Опциональные: `heroImage`, `source` (URL оригинала), `tags[]`, `updatedDate`

**Pages** (`src/pages/`):
- `index.astro` — главная страница
- `blog/index.astro` — список статей (сортировка по pubDate desc)
- `blog/[...slug].astro` — динамическая генерация страниц статей
- `rss.xml.js` — RSS-фид
- `about.astro` — страница "О проекте"

**Components** (`src/components/`):
- `BaseHead.astro` — мета-теги, SEO
- `Header.astro`, `Footer.astro` — навигация
- `FormattedDate.astro` — форматирование дат

**Layout**: `src/layouts/BlogPost.astro` — шаблон страницы статьи

**Constants**: `src/consts.ts` — `SITE_TITLE`, `SITE_DESCRIPTION`

## Article Format

```markdown
---
title: 'Заголовок статьи'
description: 'Краткое описание в 2–3 предложения.'
pubDate: '2026-03-25'
tags: ['llm', 'anthropic']
source: 'https://example.com/original-article'
---

Текст статьи. 300–500 слов.
```

## Integrations

- `@astrojs/mdx` — MDX-поддержка
- `@astrojs/rss` — RSS-генерация
- `@astrojs/sitemap` — sitemap
- `sharp` — оптимизация изображений

## Digest Pipeline

- Формат статьи: 3–5 новостей, 100–150 слов каждая.
- Критерии отбора: AI/ML тематика, вышло за последнюю неделю, практическая ценность для разработчиков.
- Редполитика: разговорный тон, без маркетинга, без оценочных суждений.
- Обложка: 1200x630, минималистичный стиль.
- Файлы статей: `src/content/blog/YYYY-MM-DD-digest.md`