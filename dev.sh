#!/usr/bin/env bash
# Run the publishing platform locally — Django CMS + Next.js front-end.
#
# Mirrors The Atlantic's setup:
#   - editors push articles via the Django admin at http://localhost:8000/admin
#     (superuser: admin / admin)
#   - the Next.js front-end at http://localhost:3030 fetches from the CMS
#     and revalidates every 180s, the same way ISR fronted by Varnish does
#     at theatlantic.com.

set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo
  echo "Shutting down..."
  jobs -p | xargs -r kill 2>/dev/null || true
}
trap cleanup EXIT INT TERM

cd "$HERE/cms"
source .venv/bin/activate
echo "▸ Django CMS  http://localhost:8000  (admin/admin)"
python manage.py runserver 8000 --noreload &

sleep 2
cd "$HERE"
echo "▸ Next.js     http://localhost:3030"
npm run dev &

wait
