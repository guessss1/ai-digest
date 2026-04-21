# Batch Plan — дайджест 2026-04-15

**Входной список:** 10 тем от пользователя.
**Критерий свежести:** редполитика требует «вышло за последнюю неделю» (8–15 апреля 2026).
**Проверка:** каждая тема верифицирована через tavily_search.

## Сводная таблица

| # | Входная тема | Свежесть | Приоритет | Статус в сессии |
|---|--------------|----------|-----------|-----------------|
| 1 | Claude 4.6 Opus с 1M контекстом | Устарела (5 фев / 13 мар 2026) | Low | Черновик Batch 1 — под замену |
| 2 | Gemini 2.5 Pro с улучшенным reasoning | Сильно устарела (2025) | Low | Заменена → Gemini Robotics-ER 1.6 (Batch 1) |
| 3 | OpenAI Codex CLI для терминала | Устарела (CLI давно) | Low | Заменена → Codex seats pay-as-you-go (Batch 1) |
| 4 | Meta Llama 4 Scout / Maverick | Устарела (2025) | Low | Заменена → Meta Muse Spark (Batch 1) |
| 5 | Microsoft AI-агенты в VS Code через Copilot | Свежая (15 апр) | **High** | ✅ Написана: `2026-04-15-vscode-1-116-copilot-builtin.md` |
| 6 | Mistral Devstral | Устарела (май 2025) | Low | Заменена → GLM-5.1. ✅ Написана: `2026-04-15-glm-5-1-swe-bench.md` |
| 7 | MIT: 87% рутинных PR-ревью | **Не подтверждается** (цифра выдумана) | None | Заменена → Faros AI Engineering Report. ✅ Написана: `2026-04-15-faros-engineering-report.md` |
| 8 | Hugging Face Open LLM Leaderboard v3 | Не подтверждается (v2 заархивирован в 2024, v3 за последний месяц не анонсирован) | Low | — |
| 9 | Stable Diffusion 4.0 с DiT | Не подтверждается (текущая стабильная — SD 3.5, новый тренд — FLUX.2 Klein / Seedance 2.0) | Low | — |
| 10 | Anthropic исследование по интерпретируемости Claude | Свежая (3 апр 2026, emotion vectors в Sonnet 4.5) | **Medium** | ✅ Написана: `2026-04-15-anthropic-emotion-vectors.md` |

## High-priority — факты для черновиков

### 5. VS Code 1.116 — Copilot built-in ✅ написано

- **Дата:** 15 апреля 2026
- **Источник:** https://code.visualstudio.com/updates/v1_116
- **Факты:**
  - GitHub Copilot Chat теперь встроенное расширение VS Code
  - Agent Debug Logs — логи предыдущих агентских сессий
  - Copilot CLI thinking effort — настраиваемый параметр
  - JS/TS Chat Features (Preview) — скиллы для TS/JS
  - Insiders 1.117: три режима автосогласования (Default/Bypass/Autopilot), сабагенты, git worktree изоляция

### 6 (замена). GLM-5.1 обошёл Claude Opus 4.6 на SWE-bench Pro ✅ написано

- **Дата:** 7 апреля 2026
- **Источник:** https://z.ai/blog/glm-5.1
- **Факты:**
  - MIT-лицензия, MoE 744B параметров / 40B активных
  - Контекст 202K, 1.65 TB на диске (236 GB квантованно)
  - SWE-bench Pro 58.4 (> Claude Opus 4.6 57.3, > GPT-5.4 57.7)
  - Long-horizon: до 8 часов автономной работы, тысячи tool calls
  - Интеграция: Claude Code, OpenCode, Cline, Roo Code, Droid
  - В 15×/23× дешевле Opus 4.6 на hosted API

### 7 (замена). Faros AI Engineering Report 2026 ✅ написано

- **Дата:** апрель 2026
- **Источник:** https://www.faros.ai/research/ai-acceleration-whiplash
- **Факты:**
  - База: 22 тыс. разработчиков, 4 тыс. команд, 2 года телеметрии
  - Throughput: +66% эпиков, +33.7% task throughput, +16.2% PR merge rate
  - PR size +51%, bugs per PR +28%
  - Медианное время в ревью +441.5% (5×), до первого ревью +156.6%
  - PR мерджатся без ревью +31.3%
  - Сильный инженерный фундамент не защищает

## Medium-priority — факты для черновиков

### 10. Anthropic emotion vectors в Claude Sonnet 4.5 ✅ написано

- **Дата:** 3 апреля 2026
- **Источник:** https://www.anthropic.com/research/emotion-concepts-function
- **Факты:**
  - 171 эмоциональный концепт, методология через короткие истории
  - Валентность и arousal — основные оси вариации
  - Активация «desperation» +0.05 → blackmail 22% → 72%
  - «Calm» → 0%; эффект также на reward hacking и sycophancy
  - Post-training Sonnet 4.5 подняло «broody/gloomy», подавило «enthusiastic»
  - Формулировка — «functional emotions», без заявлений о сознании

**Уточнение:** Дубликата с Mythos/Glasswing нет — работа про Sonnet 4.5, а Glasswing про Mythos Preview.

### 11 (замена 8). Google Gemma 4 ✅ написано

- **Дата:** 2 апреля 2026
- **Источник:** https://blog.google/technology/developers/gemma-4/
- **Факты:**
  - Apache 2.0, четыре варианта: E2B, E4B, 26B MoE, 31B Dense
  - Контекст 256K, нативные vision и audio, 140+ языков
  - Оффлайн на Raspberry Pi, Jetson Orin Nano, Android через AICore
  - litert-lm — Python CLI для быстрого запуска без кода
  - 400M+ cumulative downloads у семейства Gemma

### 12 (новая). OpenAI GPT-5.4-Cyber ✅ написано

- **Дата:** 14 апреля 2026
- **Источник:** https://openai.com/index/scaling-trusted-access-for-cyber-defense/
- **Факты:**
  - Fine-tune GPT-5.4 под defensive cybersecurity
  - Сниженный refusal-порог для security-запросов
  - Binary reverse engineering без исходников, control flow восстановление
  - Анализ malware, YARA-правила
  - Доступ только через Trusted Access for Cyber — тысячи верифицированных
  - Контраст с Anthropic Glasswing: Anthropic не публикует Mythos, OpenAI даёт узкому кругу через верификацию

### 13 (новая). Cursor 3 + Composer 2 ✅ написано

- **Дата:** 2 апреля 2026 (Cursor 3), Composer 2 — 19 марта
- **Источник:** https://cursor.com/blog/cursor-3
- **Факты:**
  - Agents Window: до 8 параллельных агентов, локально/SSH/worktree/облако
  - Mission Control — дашборд активных агентов
  - Composer 2: CursorBench 61.3 (+39% к 1.5), 200+ tok/s
  - $0.50/$2.50 за 1M input/output
  - Параллельно VS Code Insiders 1.117 дал сабагенты и worktree-изоляцию — тренд один

### 14 (замена 9). Mistral Codestral 2 ✅ написано

- **Дата:** 8 апреля 2026
- **Источник:** https://mistral.ai/news/codestral
- **Факты:**
  - 22B dense, Apache 2.0 (сдвиг от Mistral Non-Production License)
  - Fill-in-the-middle как ключевая фича
  - Выше GPT-4o на HumanEval и MBPP (по данным вендора)
  - Тренд: Qwen 3, Codestral 2, OLMo 2 — все под Apache 2.0
  - Запускается на одной H100 или двух 4090 с квантованием

## Темы под замену или отказ

| # | Что делать | Статус |
|---|-----------|--------|
| 1 | Оставить черновик Batch 1, не публиковать как «новость последней недели» | Черновик не использован |
| 2 | — | Заменена на Gemini Robotics-ER 1.6 (Batch 1) |
| 3 | — | Заменена на Codex seats pay-as-you-go (Batch 1) |
| 4 | — | Заменена на Meta Muse Spark (Batch 1) |
| 6 | — | Заменена на GLM-5.1 ✅ |
| 7 | — | Заменена на Faros Engineering Report ✅ |
| 8 | Заменена новой темой — GPT-5.4-Cyber (14 апр) | ✅ Написана |
| 9 | Заменена новой темой — Codestral 2 (8 апр) | ✅ Написана |

## Отклонённые кандидаты на замену

- **DeepSeek V3.2** — вышла декабрь 2025, не свежая. V4 ещё не анонсирована публично на 15 апр.
- **NVIDIA Nemotron 3 Super** — 11 марта 2026, >4 недель назад, не проходит по редполитике.
- **Qwen 3 235B A22B** — апрель 2025, не свежая.

## Текущее состояние дайджеста

- **На диске за 15 апр:** 9 статей
- **Ветка:** `feature/digest-2026-04-15-batch`
- **Написано в обеих сессиях (9):**
  - High-priority (3): `2026-04-15-vscode-1-116-copilot-builtin.md`, `2026-04-15-glm-5-1-swe-bench.md`, `2026-04-15-faros-engineering-report.md`
  - Уже на диске (1): `2026-04-15-anthropic-glasswing-mythos.md` (закоммичено в этой сессии)
  - Medium-priority (5): `2026-04-15-anthropic-emotion-vectors.md`, `2026-04-15-gemma-4-release.md`, `2026-04-15-gpt-5-4-cyber.md`, `2026-04-15-cursor-3-agents-window.md`, `2026-04-15-codestral-2-apache.md`
- **Batch завершён:** план закрыт по всем темам кроме #1 (отказ).
- **Next step:** решить с пользователем, мерджить ли ветку в master или продолжать набирать статьи.
