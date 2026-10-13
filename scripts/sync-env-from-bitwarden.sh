#!/usr/bin/env bash
set -euo pipefail

# Materializes a .env file from Bitwarden Secrets Manager. Never commit the
# output file. Requires the `bws` CLI and a machine-account access token.
#
# Usage:
#   export BWS_ACCESS_TOKEN=<machine-account-token>
#   ./scripts/sync-env-from-bitwarden.sh backend/.env [project-id]
#   ./scripts/sync-env-from-bitwarden.sh frontend/.env.production [project-id]

if [ -z "${BWS_ACCESS_TOKEN:-}" ]; then
  echo "BWS_ACCESS_TOKEN is not set. Export the Bitwarden machine-account token first." >&2
  exit 1
fi

if ! command -v bws >/dev/null 2>&1; then
  echo "bws CLI not found. Install it: https://bitwarden.com/help/secrets-manager-cli/" >&2
  exit 1
fi

OUT_FILE="${1:?Usage: $0 <output-env-file> [project-id]}"
PROJECT_ID="${2:-}"

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

if bws secret list ${PROJECT_ID} --output env > "$TMP_FILE" 2>/dev/null; then
  :
else
  # Older bws versions don't support --output env; fall back to JSON + jq.
  if ! command -v jq >/dev/null 2>&1; then
    echo "This bws version needs JSON output, which requires jq. Install jq and retry." >&2
    exit 1
  fi
  bws secret list ${PROJECT_ID} --output json \
    | jq -r '.[] | "\(.key)=\(.value)"' > "$TMP_FILE"
fi

mkdir -p "$(dirname "$OUT_FILE")"
mv "$TMP_FILE" "$OUT_FILE"
chmod 600 "$OUT_FILE"
trap - EXIT

echo "Wrote $(wc -l < "$OUT_FILE") secrets to $OUT_FILE (mode 600)"
