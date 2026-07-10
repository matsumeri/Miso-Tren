#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Uso: bash scripts/bump-version.sh <patch|minor|major>"
  exit 1
fi

BUMP_TYPE="$1"
MANIFEST_FILE="manifest.webmanifest"
APP_FILE="app.js"
SW_FILE="service-worker.js"

if [[ ! -f "$MANIFEST_FILE" || ! -f "$APP_FILE" || ! -f "$SW_FILE" ]]; then
  echo "Error: ejecuta este script desde la raiz del repo."
  exit 1
fi

CURRENT_VERSION="$(grep -m1 '"version"' "$MANIFEST_FILE" | sed -E 's/.*"version": "([0-9]+\.[0-9]+\.[0-9]+)".*/\1/')"

if [[ -z "$CURRENT_VERSION" ]]; then
  echo "Error: no se pudo leer la version actual desde $MANIFEST_FILE"
  exit 1
fi

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case "$BUMP_TYPE" in
  patch)
    PATCH=$((PATCH + 1))
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  *)
    echo "Tipo invalido: $BUMP_TYPE"
    echo "Usa: patch | minor | major"
    exit 1
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

sed -E -i "s/(\"version\": \")[0-9]+\.[0-9]+\.[0-9]+(\")/\1${NEW_VERSION}\2/" "$MANIFEST_FILE"
sed -E -i "s/(const APP_VERSION = \")[0-9]+\.[0-9]+\.[0-9]+(\")/\1${NEW_VERSION}\2/" "$APP_FILE"
sed -E -i "s/(const APP_VERSION = \")[0-9]+\.[0-9]+\.[0-9]+(\")/\1${NEW_VERSION}\2/" "$SW_FILE"

echo "Version actual: $CURRENT_VERSION"
echo "Nueva version: $NEW_VERSION"
echo "Archivos actualizados:"
echo "- $MANIFEST_FILE"
echo "- $APP_FILE"
echo "- $SW_FILE"
