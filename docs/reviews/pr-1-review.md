# Review PR #1 — «Дайджест: 14 статей за 14–21 апреля + чистые URL без даты»

**Автор:** @guessss1 · **Ветка:** `feature/digest-2026-04-15-batch` → `master` · **Статус:** MERGED · **Диф:** +329 / −1, 13 файлов
**Ревьюеры:** Security, Performance, Tests · **Компиляция:** лид
**Дата ревью:** 2026-04-22

---

## Сводный приоритет

| # | Находка | Категория | От кого |
|---|---|---|---|
| 1 | `generateId` в `src/content.config.ts:10-11` не покрыт тестами; опечатка в regex = падение всех URL блога | **Critical (Tests)** | Tests |
| 2 | Нет guard на коллизию slug после удаления префикса даты (два файла с одинаковым хвостом → `duplicate id`) | **Critical (Tests)** / **Warning (Sec+Perf)** | Tests / Security / Performance |
| 3 | `2026-04-15-gpt-5-4-cyber.webp` — 96.6 KB, в 2–3× жирнее соседей (11–66 KB) | **Warning (Perf)** | Performance |
| 4 | Автотестов почти нет: vitest есть, покрыт только `parseArticle`; новая ветка логики и schema не покрыты | **Warning (Tests)** | Tests |
| 5 | Нет негативных тестов на frontmatter-схему (невалидный `pubDate`, пропуск полей, битый `heroImage`) | **Warning (Tests)** | Tests |
| 6 | Нет CI-смоука `astro build` — test plan описывает только ручные шаги | **Warning (Tests)** | Tests |
| 7 | `docs/batch-plan.md` — внутренний план-документ в публичном репо (имена инструментов, рабочие заметки) | **Suggestion (Sec)** / **Suggestion (Perf)** | Security / Performance |
| 8 | Astro рендерит raw HTML в markdown без `rehype-sanitize` — defense-in-depth при росте числа контрибьюторов | **Suggestion (Sec)** | Security |
| 9 | `pubDate` во frontmatter не сверяется с префиксом имени файла — теоретическая возможность антидатирования | **Suggestion (Sec)** | Security |
| 10 | `generateId` — два последовательных `.replace` с литералами; микрооптимиз на одну regex | **Suggestion (Perf)** | Performance |
| 11 | Директория `src/content/blog/` с парными `.md + .webp` — подумать о подкаталогах при росте коллекции | **Suggestion (Perf)** | Performance |

---

## Critical

### C1. `generateId` без unit-тестов
**Файл:** `src/content.config.ts:10-11`
**Суть:** новая функция `entry.replace(/\.(md|mdx)$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')` — критический путь, от которого зависят все URL блога и `getStaticPaths` в `src/pages/blog/[...slug].astro`. Регрессия не ловится ничем, кроме ручного `astro build`.
**Предложение:** вынести в `src/lib/slug.ts` как pure-функцию, покрыть `src/lib/slug.test.ts`. Кейсы: `2026-04-15-foo.md → foo`, `2026-04-21-google-tpu-v8-inference.mdx → google-tpu-v8-inference`, файл без префикса даты, файлы с `.md` в середине имени.

### C2. Нет guard на коллизию slug
**Файл:** `src/content.config.ts:10-11` (схема), применяется ко всем `src/content/blog/*.md`
**Суть:** после удаления даты `2026-04-15-foo.md` и `2026-04-21-foo.md` дадут одинаковый id → `duplicate id` при сборке либо перезапись маршрута. Сейчас коллизий нет (проверено всеми тремя ревьюерами), но схема хрупкая.
**Предложение:** либо тест-guard `new Set(ids).size === ids.length` в `src/content.config.test.ts`, либо runtime-assert при билде, либо вернуть дату в id и чистить только URL на роуте.

---

## Warning

### W1. `2026-04-15-gpt-5-4-cyber.webp` — 96.6 KB
**Файл:** `src/content/blog/2026-04-15-gpt-5-4-cyber.webp`
**Влияние:** +~70 KB на первую загрузку страницы с этим постом vs соседние (11–66 KB, новый hero 40 KB).
**Предложение:** пережать `-q 75–80`, ширина ≤1600 px → целевой диапазон 30–60 KB.

### W2. Покрытие тестами почти нулевое
**Контекст:** vitest настроен, но покрыт только `parseArticle` (2 теста). Новая логика slug и zod-схема blog-коллекции — вне покрытия.
**Предложение:** минимальный следующий шаг — `src/lib/slug.test.ts` + `src/content.config.test.ts` с парсом всех `.md` через zod.

### W3. Нет негативных сценариев для frontmatter
**Суть:** опечатка в `pubDate`, отсутствие `title`/`description`, битый путь `heroImage` ловятся только `astro build`. Только 1 из 11 новых статей имеет `heroImage` — для zod ОК (поле опционально), но если объявлен — нет проверки `fs.existsSync`.
**Предложение:** `describe.each` по фикстурам `tests/fixtures/invalid-frontmatter.md`, `missing-title.md`; отдельный чек существования файла `heroImage`.

### W4. Нет CI-смоука
**Контекст:** test plan в PR описывает `npm run build` и Vercel preview как ручные шаги. Регрессия может уехать в main.
**Предложение:** `.github/workflows/ci.yml` с `npm ci && npm test && npm run build`.

---

## Suggestion

- **S1 (Sec/Perf):** `docs/batch-plan.md` (148 строк) — внутренний план-документ с именами инструментов (`tavily_search`), оценками источников и рабочими заметками. Если репо публичный — вынести в `docs/internal/` под `.gitignore` или в приватное хранилище.
- **S2 (Sec):** Astro рендерит markdown с raw-HTML без `rehype-sanitize`. В текущих 11 файлах всё чисто (проверено: нет `<script>`, `<iframe>`, `on*=`, `javascript:`), но архитектурно публикация `.md` = публикация произвольного HTML/JS. Подключить `rehype-sanitize` в `astro.config.mjs` как defense-in-depth.
- **S3 (Sec):** `pubDate: z.coerce.date()` не сверяется с префиксом имени файла → теоретическая возможность антидатирования. Если важно — добавить assert на совпадение.
- **S4 (Perf):** `generateId` — два `.replace` с литералами можно свернуть в `/^\d{4}-\d{2}-\d{2}-(.+?)\.(?:md|mdx)$/`. Микрооптимиз, некритично.
- **S5 (Perf):** при росте коллекции до сотен постов `src/content/blog/` с парными `.md + .webp` станет тяжёлой для IDE и `glob`. Рассмотреть подкаталоги `blog/2026-04/`.
- **S6 (Tests):** snapshot-тест `expect(ids).toMatchSnapshot()` в `src/content.config.test.ts` ловит случайное изменение алгоритма.
- **S7 (Tests):** pre-commit hook `scripts/validate-posts.ts` — парс всех `.md` через zod + проверка существования `heroImage`-файла.

---

## Итог лида

PR прошёл как MERGED, но два критических зазора остаются актуальны для follow-up: **unit-тест `generateId` + guard на уникальность slug**. Это самая хрупкая точка — regex-driven маршрутизация без покрытия. Отдельно — отсутствие CI-смоука `astro build` делает любые будущие правки `content.config.ts` игрой в русскую рулетку.

Security-находок уровня Critical/Warning нет: diff чисто контентный, секретов, shell/path-инъекций и опасных зависимостей не внесено. Performance-профиль PR тоже не вызывает беспокойства (generateId O(1) на файл, N+1 нет, build-time вырастает на единицы секунд) — единственная конкретная точка — пережать `gpt-5-4-cyber.webp`.

**Минимальный follow-up PR:**
1. Вынести `generateId` в `src/lib/slug.ts`.
2. Покрыть тестами (`src/lib/slug.test.ts` + guard на уникальность slug).
3. Добавить CI-workflow с `npm test && npm run build`.
4. Пережать `gpt-5-4-cyber.webp`.
5. Решить судьбу `docs/batch-plan.md` (gitignore или перенос).
