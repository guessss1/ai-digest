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
| 10 | Anthropic исследование по интерпретируемости Claude | Свежая (работа по Claude Mythos / Sonnet 4.5 emotion representations) | **Medium** | Требуется уточнить дату и scope |

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

## Medium-priority — требует уточнения

### 10. Anthropic: интерпретируемость Claude

Есть два потенциальных угла, нужно копнуть перед финализацией:
- Mechanistic Interpretability of Claude Mythos (связана с Glasswing Preview — уже есть статья про Mythos на 15 апреля)
- Claude Sonnet 4.5: emotion-related internal representations (дата публикации не подтверждена)

**Риск дубликата:** Статья про Mythos / Glasswing уже на диске — интерпретируемость Mythos будет пересекаться. Перед записью уточнить, что именно за публикация и когда вышла.

## Темы под замену или отказ

| # | Что делать |
|---|-----------|
| 1 | Оставить черновик Batch 1, но не публиковать как «новость последней недели». Или переписать под поздний угол, если найдётся. |
| 8 | Отказаться. Нет подтверждения релиза v3. |
| 9 | Отказаться. SD 4.0 не анонсирован. Если нужен image-gen угол — искать через FLUX.2 Klein / Seedance 2.0. |

## Порядок написания (оставшееся)

1. **[Medium]** Anthropic интерпретируемость — уточнить дату/scope, затем черновик.
2. Обсудить с пользователем: заменять ли темы 1/8/9, и если да — подобрать актуальные (кандидаты: DeepSeek V3.2, Gemma 4, NVIDIA Nemotron 3 Super, Claude Sonnet 4.5 emotion representations).

## Текущее состояние дайджеста

- **На диске за 15 апр:** 4 статьи (glasswing-mythos + 3 high-priority из этого батча)
- **Ветка:** `feature/digest-2026-04-15-batch`
- **Написано в этой сессии (3):**
  - `2026-04-15-vscode-1-116-copilot-builtin.md`
  - `2026-04-15-glm-5-1-swe-bench.md`
  - `2026-04-15-faros-engineering-report.md`
- **Под замену / отказ:** 3 темы (1, 8, 9)
- **Требуют уточнения:** 1 тема (10, Medium — риск дубликата с glasswing-mythos)
- **Осталось до «5 статей»:** 2 — нужен выбор пользователя (темы 1/8/9 с заменой или Medium #10 с уточнением даты)
