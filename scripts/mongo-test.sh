#!/usr/bin/env bash
# Ejecuta comandos nativos de mongosh y muestra comando + salida sin formateo adicional.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ -f "$ROOT_DIR/.env" ]]; then
  # shellcheck disable=SC1091
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi

MONGO_URI="${MONGODB_URI:-mongodb://localhost:27017}"
DB_NAME="${MONGODB_DB:-cine_uneti}"

if command -v mongosh &>/dev/null; then
  MONGO_CMD=(mongosh "$MONGO_URI/$DB_NAME" --quiet)
elif command -v mongo &>/dev/null; then
  MONGO_CMD=(mongo "$MONGO_URI/$DB_NAME" --quiet)
else
  echo "Error: mongosh o mongo no está instalado." >&2
  exit 1
fi

run() {
  local cmd="$1"
  printf '\n> %s\n' "$cmd"
  "${MONGO_CMD[@]}" --eval "$cmd"
}

printf 'mongosh "%s/%s"\n' "$MONGO_URI" "$DB_NAME"

COLLECTIONS=(peliculas directores generos actores resenas)

run "db.getMongo()"
run "db.getName()"
run "db.getCollectionNames()"
run "db.getCollectionInfos()"

for collection in "${COLLECTIONS[@]}"; do
  run "db.${collection}.countDocuments()"
  run "db.${collection}.findOne()"
  run "db.${collection}.find()"
done

run "db.stats()"
