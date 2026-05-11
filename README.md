# 6454565.xyz

An editorial review modeled on The Atlantic — the same publishing architecture, the same look.

## Architecture (mirrors theatlantic.com)

```
                   ┌──────────────┐
  editors  ──►   │  Django CMS  │   admin UI + headless JSON API
                   │  (publisher) │   /api/articles/  /api/articles/<slug>/
                   └──────┬───────┘   /api/articles/cover/
                          │ JSON (Cache-Control: s-maxage=180)
                          ▼
                   ┌──────────────┐
                   │   Next.js    │   App Router, ISR revalidate=180
                   │ (front-end)  │   Server components fetch from CMS
                   └──────┬───────┘
                          ▼
                   ┌──────────────┐
                   │  Cloudflare  │   edge cache + DNS for 6454565.xyz
                   └──────────────┘
```

- **CMS**: Django 4.2 + DRF, SQLite for dev, Postgres for prod. Custom in-house editorial app — exactly The Atlantic's pattern (their own podcast interview confirms an in-house Django CMS that replaced three legacy systems).
- **Front-end**: Next.js 15 (App Router, React 19) — the same stack `theatlantic.com` runs on (confirmed via `_next/static` markers + `data-next-head`).
- **Edge**: `Cache-Control: s-maxage=180` matches Atlantic's exact cache config.

## Local dev

```bash
./dev.sh
```

This starts:
- Django CMS at <http://localhost:8000> (admin login: `admin` / `admin`)
- Next.js front-end at <http://localhost:3030>

Routes:
- `/` — magazine cover, pulled live from the CMS
- `/articles/<slug>` — article page, template selected by the editor in the CMS
- `/first-post` — legacy alias, 307 → `/articles/first-post`

## Editorial workflow

1. Sign in at <http://localhost:8000/admin>.
2. Open **Editorial → Articles**. Edit the cover story or create a new one.
3. Per article, pick a **Layout**: Classic / Full-bleed / Immersive.
4. Tick **Is cover** to promote a story to the lead well on `/`.
5. Save. The Next.js front-end picks it up within 180 seconds (ISR), or instantly on next page-revalidation request.

The Article body is a JSON list of typed blocks:

```json
[
  {"type": "p", "text": "Opening paragraph.", "dropcap": true},
  {"type": "p", "text": "Second paragraph."},
  {"type": "h2", "text": "Section Header"},
  {"type": "p", "text": "More body."}
]
```

## Deploy

Domain is on **Cloudflare** (DNS). Recommended deploy:

| Piece       | Host                  | URL                     |
|-------------|-----------------------|-------------------------|
| Next.js     | Vercel                | `6454565.xyz`           |
| Django CMS  | Railway (or Fly.io)   | `cms.6454565.xyz`       |

### 1. Deploy Django CMS to Railway
```bash
cd cms
# Create a Railway project at https://railway.app/new and connect this folder.
# Railway auto-detects requirements.txt + manage.py.
# Add a Postgres plugin and set DATABASE_URL.
# In settings.py, swap SQLite for the Postgres URL when DATABASE_URL is set.
# Run: python manage.py migrate && python manage.py seed && python manage.py createsuperuser
```
Railway gives you a URL like `publisher-production.up.railway.app`. Add `cms.6454565.xyz` as a custom domain in Railway.

### 2. Deploy Next.js to Vercel
```bash
npm i -g vercel
vercel              # link & preview
vercel --prod
```
In Vercel project settings:
- Set env var `CMS_URL=https://cms.6454565.xyz`
- Add custom domain `6454565.xyz`

### 3. DNS records in Cloudflare
In the 6454565.xyz zone, **proxy off (gray cloud)** for both — Vercel and Railway handle their own certs and want a direct CNAME:

| Type  | Name | Target                       |
|-------|------|------------------------------|
| CNAME | `@`  | `cname.vercel-dns.com`       |
| CNAME | `www`| `cname.vercel-dns.com`       |
| CNAME | `cms`| (the Railway-assigned target)|

(Vercel and Railway will display the exact CNAME values after you add the custom domains.)

## Stack details

**Back end** (`cms/`):
- Django 4.2 LTS, DRF, django-cors-headers
- App `editorial`: `Author`, `Section`, `Article` (title, slug, dek, JSON body, hero, template, is_cover, read_minutes, published_at)
- Custom seed command: `python manage.py seed`

**Front end** (`src/`):
- Next.js 15 App Router, React 19, TypeScript, Tailwind 3
- Fonts via `next/font/google`: Source Serif 4, Playfair Display, Inter
- Editorial palette: ink `#111`, paper `#FBF9F5`, rule `#E6E1D6`, accent per section
- Template registry under `src/components/templates/` — Classic, FullBleed, Immersive
