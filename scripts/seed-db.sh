#!/usr/bin/env bash
# Pobla la base de datos MongoDB con las 5 colecciones del proyecto.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "========================================"
echo "  Seed MongoDB - Cine UNETI (Linux)"
echo "========================================"

cd "$ROOT_DIR"
node backend/src/seed/seed.js

echo "Seed completado."
