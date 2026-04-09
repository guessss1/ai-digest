# AI Digest Development Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Доработать AI Digest: добавить систему тегов, modern dark design на Tailwind, blog features и настроить деплой.

**Current State:** Digest Pipeline реализован (scripts/). Базовый Astro-блог работает. Нужны UI-улучшения.

**Tech Stack:** Astro 6, Tailwind CSS 4, TypeScript

---

## File Structure

### New files to create

```
src/pages/tags/
  index.astro              — страница всех тегов
  [tag].astro              — динамическая страница тега

src/components/
  TagList.astro            — теги-пиллы для карточек и постов
  TagCloud.astro           — облако тегов
  ReadingTime.astro        — время чтения
  Pagination.astro         — пагинация
  RelatedPosts.astro       — похожие посты
```

### Existing files to modify

```
src/components/Header.astro      — добавить ссылку Tags
src/layouts/BlogPost.astro       — добавить теги, время чтения, related posts
src/pages/blog/index.astro       — добавить теги на карточки
src/pages/index.astro            — hero + latest posts
src/components/FormattedDate.astro — русская локаль
src/styles/global.css            — Tailwind темизация
astro.config.mjs                 — Tailwind integration
package.json                     — Tailwind dependency
```

---

## Chunk 1: Tag System

### Task 1: TagList component

**Files:**
- Create: `src/components/TagList.astro`

- [ ] **Step 1: Create TagList component**

```astro
---
interface Props {
  tags: string[];
  size?: 'sm' | 'md';
}

const { tags, size = 'sm' } = Astro.props;
---

{tags.length > 0 && (
  <div class:list={['tag-list', size]}>
    {tags.map((tag) => (
      <a href={`/tags/${tag}/`} class="tag">
        {tag}
      </a>
    ))}
  </div>
)}

<style>
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .tag {
    display: inline-block;
    padding: 0.2em 0.6em;
    border-radius: 6px;
    font-size: 0.8rem;
    text-decoration: none;
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
    transition: background 0.2s;
  }
  .tag:hover {
    background: rgba(99, 102, 241, 0.2);
  }
  .md .tag {
    font-size: 0.9rem;
    padding: 0.3em 0.8em;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TagList.astro
git commit -m "feat(tags): add TagList component"
```

---

### Task 2: Add tags to BlogPost layout

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Import TagList and add to layout**

Add `tags` to destructured props, import TagList, render after title.

- [ ] **Step 2: Verify locally**

Run: `npm run dev`
Check post pages show tags.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BlogPost.astro
git commit -m "feat(tags): add tags to blog post layout"
```

---

### Task 3: Add tags to blog listing

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Import TagList, add to each post card**

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat(tags): add tags to blog listing cards"
```

---

### Task 4: Tag pages

**Files:**
- Create: `src/components/TagCloud.astro`
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Create TagCloud component**

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const tagCounts = new Map<string, number>();

for (const post of posts) {
  for (const tag of post.data.tags ?? []) {
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
}

const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);
---

<div class="tag-cloud">
  {sortedTags.map(([tag, count]) => (
    <a href={`/tags/${tag}/`} class="tag-cloud-item">
      {tag} <span class="count">({count})</span>
    </a>
  ))}
</div>

<style>
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .tag-cloud-item {
    padding: 0.4em 0.8em;
    border-radius: 8px;
    text-decoration: none;
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
    transition: background 0.2s;
  }
  .tag-cloud-item:hover {
    background: rgba(99, 102, 241, 0.2);
  }
  .count {
    opacity: 0.6;
    font-size: 0.85em;
  }
</style>
```

- [ ] **Step 2: Create tags index page**

`src/pages/tags/index.astro` — page with TagCloud.

- [ ] **Step 3: Create dynamic tag page**

`src/pages/tags/[tag].astro` — getStaticPaths + filtered posts.

- [ ] **Step 4: Add Tags link to Header**

- [ ] **Step 5: Verify locally**

Navigate: `/tags/`, `/tags/llm/`

- [ ] **Step 6: Commit**

```bash
git add src/pages/tags/ src/components/TagCloud.astro src/components/Header.astro
git commit -m "feat(tags): add tag pages and navigation"
```

---

## Chunk 2: Blog Features

### Task 5: Reading time

**Files:**
- Create: `src/components/ReadingTime.astro`
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Create ReadingTime component**

```astro
---
interface Props { content: string }
const { content } = Astro.props;
const words = content.split(/\s+/).length;
const minutes = Math.max(1, Math.round(words / 200));
---
<span class="reading-time">{minutes} мин. чтения</span>
```

- [ ] **Step 2: Add to BlogPost layout**

- [ ] **Step 3: Commit**

```bash
git add src/components/ReadingTime.astro src/layouts/BlogPost.astro
git commit -m "feat(blog): add reading time estimate"
```

---

### Task 6: Related posts

**Files:**
- Create: `src/components/RelatedPosts.astro`
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Create RelatedPosts component**

Find posts with most shared tags, exclude current, take top 3.

- [ ] **Step 2: Add to BlogPost layout after content**

- [ ] **Step 3: Commit**

```bash
git add src/components/RelatedPosts.astro src/layouts/BlogPost.astro
git commit -m "feat(blog): add related posts section"
```

---

### Task 7: Russian date formatting

**Files:**
- Modify: `src/components/FormattedDate.astro`

- [ ] **Step 1: Update to Russian locale**

```astro
---
interface Props { date: Date }
const { date } = Astro.props;
---
<time datetime={date.toISOString()}>
  {date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
</time>
```

- [ ] **Step 2: Fix html lang="ru" in layouts/pages**

- [ ] **Step 3: Commit**

```bash
git add src/components/FormattedDate.astro src/pages/ src/layouts/
git commit -m "feat(i18n): Russian date formatting and html lang"
```

---

## Chunk 3: Tailwind Design (Optional)

### Task 8: Install Tailwind

- [ ] **Step 1: Install**

```bash
npx astro add tailwindcss
```

- [ ] **Step 2: Configure dark theme tokens in global.css**

- [ ] **Step 3: Commit**

```bash
git add package.json astro.config.mjs src/styles/global.css
git commit -m "feat(design): add Tailwind CSS"
```

---

### Task 9: Redesign components with Tailwind

- [ ] **Step 1: Header** — dark sticky nav
- [ ] **Step 2: Footer** — update copyright
- [ ] **Step 3: Homepage** — hero + cards
- [ ] **Step 4: Blog listing** — card grid
- [ ] **Step 5: BlogPost layout** — prose styling

- [ ] **Step 6: Commit**

```bash
git add src/components/ src/pages/ src/layouts/
git commit -m "feat(design): modern dark theme"
```

---

## Chunk 4: Deployment

### Task 10: Vercel setup

- [ ] **Step 1: Install adapter**

```bash
npx astro add vercel
```

- [ ] **Step 2: Update site URL in astro.config.mjs**

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Deploy**

```bash
npx vercel
```

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs package.json
git commit -m "feat(deploy): configure Vercel"
```

---

## Execution Order

| Chunk | Tasks | Priority |
|-------|-------|----------|
| 1 | 1–4 | High — tag navigation |
| 2 | 5–7 | Medium — blog UX |
| 3 | 8–9 | Low — visual polish |
| 4 | 10 | Medium — go live |

Chunk 1 + 2 можно сделать без Tailwind. Chunk 3 опционален.
