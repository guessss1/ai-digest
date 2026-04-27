#!/usr/bin/env bash
# PostToolUse-хук: пишет трассировку всех tool_use в logs/pipeline.log.
# Формат строки: ISO-timestamp tool_name first-100-chars-of-input
DATA=$(cat)
TS=$(date -Iseconds)
NAME=$(echo "$DATA" | jq -r '.tool_name // "unknown"' 2>/dev/null)
INPUT=$(echo "$DATA" | jq -r '.tool_input | tostring' 2>/dev/null | head -c 100)
mkdir -p logs
echo "$TS $NAME $INPUT" >> logs/pipeline.log
exit 0
