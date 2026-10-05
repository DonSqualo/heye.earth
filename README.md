# heye.earth

Static Hugo build of [heye.earth](https://heye.earth), replacing the Notion → super.so → Cluster
setup that stopped working when super.so changed its renderer. The site looks and behaves like the
last maintained version (November 2023 custom code) but depends on nothing external any more:
all content, images, videos and fonts live in this repository.

## Run it

```sh
hugo server            # http://localhost:1313
hugo                   # writes public/
```

Hugo ≥ 0.165 (extended not required). No Node, no npm.

## How it is put together

| Piece | Where | Notes |
|---|---|---|
| Page chrome (navbar, header, footer, search modal) | `themes/heye/layouts/partials/` | Same DOM super.so rendered in 2023, so the vendored CSS applies unchanged |
| Landing page | `themes/heye/layouts/index.html` + `data/landing.yaml` | Renders statically what the old `Home.js` built at runtime; `js/home.js` only adds behaviour |
| Content pages | `content/**/*.html` | Raw Notion HTML exported from super.so, one file per page, YAML front matter (title, url, icon, cover, breadcrumbs, dates) |
| super.so stylesheet (April 2023 build) | `themes/heye/static/css/super-notion.css`, `super-theme.css` | KaTeX fonts rewritten to local copies |
| Cluster theme by Josh Millgate | `themes/heye/static/css/cluster.css`, `prism.css` | May 2023 edition (the later one targets super.so v2's navbar) |
| Custom code, last deployed version | `themes/heye/static/css/custom-global.css`, `custom-home.css`, `static/js/*.js` | Originals kept verbatim under `legacy/` |
| Assets | Cloudinary folder `heye-earth/` (cloud `deepwave-org`), map in `data/cdn.json` | Originals kept locally in `assets-src/` (not in git). `params.cdn.enabled` in `hugo.toml` switches between CDN and local `static/assets/` |
| Fonts | `themes/heye/static/fonts/` | Manrope, Merriweather (as served by super.so), Roboto Mono, KaTeX |

### JavaScript

* `theme.js` – light/dark switch (same localStorage key and default-dark behaviour as before).
* `home.js` – slides rotate every 10 s; hover/wheel/arrow keys/swipe switch slides; clicking a slide
  pushes its URL, scrolls down and fetches the page's `<article>` under the hero; mobile top bar,
  progress bar, hamburger for the loaded page's sidebar; mouse trailer with per-slide arrow cursor.
* `page.js` – Notion toggles, code copy buttons, lazy loading of Twitter widgets / Orbit review areas.
* `search.js` – site search over the static index at `/index.json`, rendered into super.so's modal markup
  (`Ctrl/⌘+K`, arrows, enter, esc).

### Landing slides

Edit `data/landing.yaml`. Each slide has a background (`bg`, optional `bg_mobile`, `bg_video`),
title artwork (`title_img`, optional `title_video`), cursor arrow and the CSS class names the old
`Home.css` expects. The old site asked Cloudinary for viewport-sized crops; the same framing is now
expressed with `object-position` (`bg_pos`, `bg_pos_mobile`).

### Images and videos on Cloudinary

Every asset is served from Cloudinary with `f_auto,q_auto` (best format and quality per
browser); SVG, GIF and videos are delivered untouched. `tools/cloudinary_sync.py --dir assets-src`
uploads anything new and extends `data/cdn.json`; the theme rewrites `/assets/...` references at
build time. To work offline, copy `assets-src/` to `static/assets/` and set `params.cdn.enabled = false`.
Credentials: `~/.config/cloudinary/url` (`cloudinary://KEY:SECRET@deepwave-org`).

### Deploying to Netlify

```sh
hugo --minify
tools/netlify_deploy.py --dir public --site heye-earth            # draft deploy with its own URL
tools/netlify_deploy.py --dir public --site heye-earth --prod --domain heye.earth
```

Token in `~/.config/netlify/token` (personal access token). The script uses Netlify's file-digest
deploy API, so only changed files are uploaded. (The official CLI does not install on this machine
because its `sharp` dependency fails to build.)

## Editing content

Pages are plain HTML with Notion's class names (`notion-text`, `notion-heading`, `notion-column-list`,
…). The sidebar and the table-of-contents column are part of each page's content (Notion columns), as
they were in the Notion template. New pages can be written by hand in the same markup, or by
adding a Markdown file and extending the theme – the layout only needs `.Title`, `.Content` and the
front-matter fields listed above.

## Re-importing from super.so

The `tools/` scripts reproduce the migration (they need `beautifulsoup4` and `lxml`):

```sh
tools/crawl_live.py --site https://heye.earth --out crawl/live     # sitemap crawl
tools/extract_records.py --crawl crawl/live --out crawl/records     # Notion block data per page
tools/fetch_assets.py --crawl crawl/live                            # images/videos -> static/assets + asset-map.json
tools/import_super.py --crawl crawl/live --records crawl/records    # -> content/
```

`import_super.py` restores the 2023 block nesting that the vendored CSS expects, rebuilds embeds
from the block records (YouTube/Vimeo/Google Docs as iframes, tweets as Twitter embed blockquotes)
and rewrites every asset URL to the local copy. Pages the live site no longer served (HTTP 404) were
taken from the Wayback Machine where captures existed (`--fallback`, `fetch_wayback_assets.py`).

## What differs from the old site

* The hosted search is replaced by a static-index search (same look).
* External embeds that the old site also loaded live (YouTube, Vimeo, Google Docs/Slides, Substack,
  Spotify, Twitter widgets, Orbit review areas, the deepwave.org iframe) are still loaded from those
  services.
* Six bookmark thumbnails whose source sites are gone (two Shopify, Complice, Future Forum favicon,
  one Cloudinary image) are missing.
* 78 sitemap URLs returned 404 on the live site and have no Wayback capture (mostly
  `/life/orders-accounts/things-i-own/*`); they are not part of this site.
