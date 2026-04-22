#!/bin/bash
# Stop-хук: валидация статьи перед завершением.
# Проверяет обязательные поля frontmatter по схеме src/content.config.ts:
#   title, description, pubDate — обязательные
#   heroImage, source, updatedDate, tags — опциональные
# Exit 0 = разрешить завершение. Exit 2 = продолжить работу.

# Защита от бесконечного цикла: если Claude уже пытался завершить и был
# заблокирован — пропускаем, чтобы не зациклиться.
ACTIVE=$(jq -r '.stop_hook_active' 2>/dev/null)
if [ "$ACTIVE" = "true" ]; then
  exit 0
fi

CONTENT_DIR="src/content/blog"

if [ ! -d "$CONTENT_DIR" ]; then
  # Нет директории статей — валидировать нечего.
  exit 0
fi

# Ищем последний изменённый markdown-файл в статьях.
# Если есть git — берём файлы, новее .git/index. Иначе — самый свежий по mtime.
if [ -f ".git/index" ]; then
  ARTICLE=$(find "$CONTENT_DIR" \( -name "*.md" -o -name "*.mdx" \) -newer .git/index 2>/dev/null | head -1)
else
  ARTICLE=$(find "$CONTENT_DIR" \( -name "*.md" -o -name "*.mdx" \) -printf '%T@ %p\n' 2>/dev/null | sort -nr | head -1 | cut -d' ' -f2-)
fi

if [ -z "$ARTICLE" ]; then
  # Нет изменённых статей — значит это не цикл публикации, разрешаем.
  exit 0
fi

# Извлекаем frontmatter (между первыми двумя строками "---").
FRONTMATTER=$(awk '/^---$/{c++; next} c==1' "$ARTICLE")

ERRORS=""

if ! printf '%s\n' "$FRONTMATTER" | grep -qE "^title:[[:space:]]*\S"; then
  ERRORS="${ERRORS}Missing or empty title. "
fi

if ! printf '%s\n' "$FRONTMATTER" | grep -qE "^description:[[:space:]]*\S"; then
  ERRORS="${ERRORS}Missing or empty description. "
fi

if ! printf '%s\n' "$FRONTMATTER" | grep -qE "^pubDate:[[:space:]]*\S"; then
  ERRORS="${ERRORS}Missing or empty pubDate. "
fi

if [ -n "$ERRORS" ]; then
  echo "Article validation failed: ${ERRORS}" >&2
  echo "File: $ARTICLE" >&2
  exit 2
fi

exit 0
