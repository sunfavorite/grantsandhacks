# Grants and Hacks

Hackathons, accelerators and equity-free grants for founders, Australia first. Updated every Monday.

黑客松、加速器与不占股资助，澳洲优先，每周一更新。

Live site: https://grantsandhacks.com

## How the site is built

- `index.html` is the interactive homepage and the **single source of truth** for listings (the `D` array).
- `scripts/build-pages.mjs` turns that data into static, indexable pages so search engines and AI assistants can read and cite them:
  - `/grants/`, `/hackathons/`, `/accelerators/` with one page per listing (key facts, official source, schema.org JSON-LD)
  - `/guides/` (content in `scripts/guides.mjs`, every claim tied to an official source)
  - `sitemap.xml`, `robots.txt`, `llms.txt`
- Run `node scripts/build-pages.mjs` after editing `index.html` (Node 18+). The GitHub Action in `.github/workflows/build-pages.yml` also runs it on every push to `main` and every Monday morning, and commits the result.
- Generated folders are wiped and rebuilt each run; don't edit them by hand.

When adding a grant, put the government or program's own page in `u`. If the only link is a directory or blog, the page shows a warning asking readers to check the official site.
