#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <env-name> [port]" >&2
  exit 1
fi

ENV_NAME="$1"
PORT_ARG="${2:-}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_ROOT="${REPO_ROOT}/env/${ENV_NAME}"
PLAYER_ROOT="${ENV_ROOT}/player"
LOG_ROOT="${ENV_ROOT}/log"

if [[ -z "${PORT_ARG}" ]]; then
  if [[ "${ENV_NAME}" == "prod" ]]; then
    PORT_ARG="5000"
  else
    PORT_ARG="4000"
  fi
fi

mkdir -p "${PLAYER_ROOT}/temp" "${LOG_ROOT}"
for letter in {a..z}; do
  mkdir -p "${PLAYER_ROOT}/${letter}"
done

STAMP="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="${LOG_ROOT}/${STAMP}.log"

export CHAOS_ENV_ROOT="${ENV_ROOT}"
export CHAOS_PLAYER_DIR="${PLAYER_ROOT}/"
export CHAOS_PLAYER_TEMP_DIR="${PLAYER_ROOT}/temp"

cd "${REPO_ROOT}/area"
echo "[$(date '+%F %T')] Starting ${ENV_NAME} server on port ${PORT_ARG}. Logs: ${LOG_FILE}"
exec "${REPO_ROOT}/src/chaosium" "${PORT_ARG}" >> "${LOG_FILE}" 2>&1
