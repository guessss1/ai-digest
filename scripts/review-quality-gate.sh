#!/bin/bash
# Минимальная валидация: отчёт ревью должен содержать хотя бы одну категорию.
INPUT=$(cat)
TASK_NAME=$(echo "$INPUT" | jq -r '.task_subject // empty')

# Для задач ревью — проверяем, что описание содержит результаты.
if echo "$TASK_NAME" | grep -iq "review"; then
  DESCRIPTION=$(echo "$INPUT" | jq -r '.task_description // empty')
  if ! echo "$DESCRIPTION" | grep -iqE "(critical|warning|suggestion|no issues)"; then
    echo "Review task has no findings in standard format. Add at least one category." >&2
    exit 2
  fi
fi

exit 0
