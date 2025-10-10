#!/bin/bash
# GitHub Actions Build Monitor
# Usage: bash .claude/watch-builds.sh

echo "🔍 Monitoring GitHub Actions..."
echo ""

while true; do
  clear
  echo "═══════════════════════════════════════════════════════════"
  echo "  GitHub Actions Status - $(date '+%Y-%m-%d %H:%M:%S')"
  echo "═══════════════════════════════════════════════════════════"
  echo ""

  gh run list --limit 5 --json name,conclusion,status,createdAt,databaseId \
    --jq '.[] | "[\(.status)] \(.name) - Run ID: \(.databaseId)"'

  echo ""
  echo "───────────────────────────────────────────────────────────"
  echo "Press Ctrl+C to exit | Refreshing every 30 seconds..."
  echo "═══════════════════════════════════════════════════════════"

  sleep 30
done
