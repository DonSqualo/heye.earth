#!/usr/bin/env python3
"""Convert crawled super.so pages (HTML + the Notion records embedded in their
React flight payload) into Hugo content files.

    tools/import_super.py --crawl DIR --records DIR [--fallback DIR] --out content

For every page:
  * front matter: title, url, description, icon / cover, breadcrumbs, dates, flags
  * body: the <article class="notion-root"> HTML, cleaned up and with every
    external asset URL rewritten to the local copy listed in tools/asset-map.json
  * embeds that super.so only rendered client-side are rebuilt as iframes from the
    Notion block records; tweets become standard Twitter embed blockquotes.

Pages that have children become `_index.html` (Hugo section) so that nested URLs work.
"""
import argparse, datetime, glob, json, pathlib, re, sys, urllib.parse
from bs4 import BeautifulSoup, Comment, NavigableString

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from assetmap import safe_name  # noqa: E402

AMAP = json.load(open(HERE / "asset-map.json"))
ASSET_ROOT = HERE.parent / "assets-src"

DROP_ATTRS = {"data-server-link", "data-link-uri", "data-full-size", "data-lightbox-src", "data-nimg", "decoding", "sizes", "srcset", "fetchpriority", "imagesrcset", "imagesizes"}
IFRAME_SANDBOX = "allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"


def local_url(url):
    """Map a remote asset URL to its local /assets/... path (or return the URL unchanged)."""
    if not url or url.startswith(("data:", "#", "mailto:")):
        return url
    if url.startswith("/_next/image?"):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
        url = q.get("url", [url])[0]
    if url.startswith("/images/embeds/"):
        return url  # tiny super.so UI icon, shipped with the theme
    if url in AMAP:
        return "/assets/" + AMAP[url]
    if re.match(r"https?://", url):
        rel = safe_name(url)
        cands = [p for p in ASSET_ROOT.glob(rel + "*")] if "/" in rel else []
        if cands:
            return "/assets/" + cands[0].relative_to(ASSET_ROOT).as_posix()
    return url


DEAD_HOSTS = ("super-static-assets.s3.amazonaws.com",)


def is_local(url):
    return bool(url) and url.startswith("/assets/")


def clean_attrs(el):
    for a in list(el.attrs):
        if a in DROP_ATTRS:
            del el.attrs[a]


def block_id(el):
    i = el.get("id", "")
    return i[6:] if i.startswith("block-") else i


def rebuild_embed(el, blocks, soup):
    """Replace a super.so embed placeholder by a plain iframe using the block record."""
    rec = blocks.get(block_id(el)) or {}
    for loader in el.select(".notion-embed__loader"):
        loader.decompose()
    if el.find("iframe"):
        return
    src = rec.get("source") or rec.get("link")
    if not src:
        return
    aspect = rec.get("aspectRatio") or 0.5625
    width = rec.get("width")
    page_width = rec.get("pageWidth", True)
    align = rec.get("alignment") or "start"
    el.clear()
    el["style"] = "display:block;width:100%"
    content = soup.new_tag("span", attrs={"class": "notion-embed__content", "style": "display:flex;width:100%"})
    wrap_style = f"width:100%;display:flex;padding-bottom:{aspect * 100:.4f}%"
    if not page_width and width:
        wrap_style = f"width:{width}px;max-width:100%;display:flex;padding-bottom:{aspect * 100:.4f}%"
    wrapper = soup.new_tag("span", attrs={"class": f"notion-embed__container__wrapper align-{align}", "style": wrap_style})
    container = soup.new_tag("span", attrs={"class": "notion-embed__container", "style": "width:100%;height:100%;display:block"})
    iframe = soup.new_tag("iframe", attrs={"src": src, "title": urllib.parse.urlparse(src).netloc, "loading": "lazy", "frameborder": "0", "allowfullscreen": "", "sandbox": IFRAME_SANDBOX})
    container.append(iframe)
    wrapper.append(container)
    content.append(wrapper)
    el.append(content)


def rebuild_tweet(el, soup):
    tid = block_id(el)
    el.clear()
    bq = soup.new_tag("blockquote", attrs={"class": "twitter-tweet", "data-dnt": "true", "data-theme": "dark"})
    a = soup.new_tag("a", href=f"https://twitter.com/i/status/{tid}")
    a.string = f"Tweet {tid}"
    bq.append(a)
    el.append(bq)


def wrap_children(el, wrapper):
    for c in list(el.contents):
        wrapper.append(c.extract())
    el.append(wrapper)
    return wrapper


def normalize_2023(art, soup):
    """super.so's 2025 renderer flattens several blocks; the vendored 2023 CSS (and the
    Cluster theme / custom CSS written against it) expect the older nesting. Restore it."""
    # text blocks: <p class="notion-text notion-text__content notion-semantic-string"> -> div > p > span
    for p in art.select("p.notion-text.notion-text__content"):
        div = soup.new_tag("div", attrs={"class": "notion-text"})
        if p.get("id"):
            div["id"] = p["id"]
        extra = [c for c in p.get("class", []) if c not in ("notion-text", "notion-text__content", "notion-semantic-string")]
        p.replace_with(div)
        newp = soup.new_tag("p", attrs={"class": "notion-text__content"})
        span = soup.new_tag("span", attrs={"class": " ".join(["notion-semantic-string"] + extra)})
        for c in list(p.contents):
            span.append(c)
        newp.append(span)
        div.append(newp)
    for div in art.select("div.notion-text"):
        if not div.find(["p", "div"], recursive=False):
            newp = soup.new_tag("p", attrs={"class": "notion-text__content"})
            span = soup.new_tag("span", attrs={"class": "notion-semantic-string"})
            for c in list(div.contents):
                span.append(c)
            newp.append(span)
            div.append(newp)
    # headings: anchor span before <hN class="notion-heading notion-semantic-string"> -> inside the heading
    for h in art.select("h1.notion-heading, h2.notion-heading, h3.notion-heading, h4.notion-heading"):
        classes = [c for c in h.get("class", []) if c != "notion-semantic-string"]
        h["class"] = classes
        span = soup.new_tag("span", attrs={"class": "notion-semantic-string"})
        wrap_children(h, span)
        prev = h.find_previous_sibling()
        if prev is not None and prev.name == "span" and "notion-heading__anchor" in prev.get("class", []):
            h.insert(0, prev.extract())
        elif h.get("id", "").startswith("block-"):
            anchor = soup.new_tag("span", attrs={"class": "notion-heading__anchor", "id": h["id"][6:]})
            h.insert(0, anchor)
    # list items / quotes / callout text carrying the semantic-string class directly
    for li in art.select("li.notion-list-item.notion-semantic-string"):
        li["class"] = [c for c in li["class"] if c != "notion-semantic-string"]
        wrap_children(li, soup.new_tag("span", attrs={"class": "notion-semantic-string"}))
    # page mentions: <a class="notion-link notion-page resource"> -> <span class="resource"><a><div><div icon/><div title/></div></a></span>
    for a in art.select("a.notion-link.notion-page.resource"):
        a["class"] = [c for c in a["class"] if c != "resource"]
        icon = a.select_one(":scope > .notion-page__icon")
        title = a.select_one(":scope > .notion-page__title")
        inner = soup.new_tag("div")
        if icon is not None:
            icon.name = "div"
            inner.append(icon.extract())
        if title is not None:
            title.name = "div"
            title["class"] = ["notion-page__title"]
            tspan = soup.new_tag("span", attrs={"class": "notion-semantic-string"})
            wrap_children(title, tspan)
            inner.append(title.extract())
        for c in list(a.contents):
            inner.append(c.extract())
        a.append(inner)
        res = soup.new_tag("span", attrs={"class": "resource"})
        a.replace_with(res)
        res.append(a)
    # table of contents entries
    for a in art.select(".notion-table-of-contents__item > a"):
        if a.get("href", "").startswith("#block-"):
            a["href"] = "#" + a["href"][7:]
        a.attrs.pop("class", None)
        d = a.find("div", recursive=False)
        if d is not None and "notion-semantic-string" in d.get("class", []):
            d.attrs.pop("class", None)
            wrap_children(d, soup.new_tag("span", attrs={"class": "notion-semantic-string"}))


def process_article(art, blocks, soup):
    # strip react / super.so runtime attributes and comments
    for c in art.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    for el in art.find_all(True):
        clean_attrs(el)
    normalize_2023(art, soup)
    # local assets
    for el in art.find_all(["img", "source", "video", "audio"]):
        for attr in ("src", "poster"):
            if el.get(attr):
                el[attr] = local_url(el[attr])
    for el in art.find_all("a", href=True):
        h = el["href"]
        if h.startswith("https://heye.earth/"):
            el["href"] = h[len("https://heye.earth"):]
        elif re.search(r"\.(pdf|png|jpe?g|gif|svg|webp|mp4|webm)(\?|$)", h, re.I):
            el["href"] = local_url(h)
    # embeds / tweets
    for el in art.select(".notion-embed"):
        rebuild_embed(el, blocks, soup)
    for el in art.select(".notion-tweet"):
        rebuild_tweet(el, soup)
    # super.so's image lightbox wrappers: keep markup, drop display:contents wrappers' data attrs (done above)
    # next/image blur placeholders from 2022-era pages
    for img in art.find_all("img"):
        if (img.get("src") or "").startswith("data:image/gif"):
            ns = img.find_next_sibling("noscript")
            real = ns.find("img") if ns else None
            if real and real.get("src"):
                img["src"] = local_url(real["src"])
            else:
                img.decompose()
                continue
        if (img.get("src") or "").startswith("data:image/svg+xml") and img.get("aria-hidden") == "true":
            img.decompose()
    for ns in art.find_all("noscript"):
        ns.decompose()
    # images whose only copy lived in super.so's old S3 bucket (gone, not archived): drop rather than show a broken icon
    for img in art.find_all("img"):
        src = img.get("src") or ""
        if any(h in src for h in DEAD_HOSTS):
            block = img.find_parent(class_="notion-image")
            (block or img).decompose()
    return art


def page_meta(soup, rec, slug, path):
    head = rec.get("head") or {}
    blocks = (rec.get("records") or {}).get("block") or {}
    pid = rec.get("pageId") or slug
    page = blocks.get(pid) or {}
    title = head.get("title") or (soup.title.get_text(strip=True) if soup.title else slug)
    meta = {
        "title": title,
        "url": path,
        "notion_id": page.get("blockId", "").replace("-", "") or pid,
        "description": (head.get("description") or "").strip(),
    }
    icon = page.get("icon")
    if icon:
        if re.match(r"https?://", icon):
            if is_local(local_url(icon)):
                meta["icon_image"] = local_url(icon)
        else:
            meta["icon"] = icon
    cover = page.get("cover")
    if cover and not page.get("noCover") and is_local(local_url(cover)):
        meta["cover"] = local_url(cover)
        meta["cover_position"] = page.get("coverPosition", 0.5)
    if head.get("image") and is_local(local_url(head["image"])):
        meta["og_image"] = local_url(head["image"])
    meta["full_width"] = bool(page.get("fullWidth", False))
    meta["small_text"] = bool(page.get("smallText", False))
    for key, src in (("date", "createdTime"), ("lastmod", "lastEditedTime")):
        ts = page.get(src)
        if ts:
            meta[key] = datetime.datetime.fromtimestamp(ts / 1000, datetime.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    crumbs = []
    for a in soup.select(".notion-navbar .notion-breadcrumb a.notion-breadcrumb__item")[1:]:
        t = a.get_text(" ", strip=True)
        if t:
            crumbs.append({"title": t, "url": a.get("href", path)})
    meta["breadcrumbs"] = crumbs
    return meta


def yaml_str(v):
    return json.dumps(v, ensure_ascii=False)


def front_matter(meta):
    lines = ["---"]
    for k, v in meta.items():
        if v in (None, "", [], {}):
            continue
        if isinstance(v, bool):
            lines.append(f"{k}: {'true' if v else 'false'}")
        elif isinstance(v, (int, float)):
            lines.append(f"{k}: {v}")
        elif isinstance(v, list):
            lines.append(f"{k}:")
            for item in v:
                lines.append("  - " + ", ".join(f"{kk}: {yaml_str(vv)}" for kk, vv in item.items()).join(["{", "}"]))
        else:
            lines.append(f"{k}: {yaml_str(v)}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def convert(html_path, records_dir, out_dir, section_paths):
    slug = html_path.stem
    path = "/" + slug.replace("_", "/")
    html = html_path.read_text(errors="ignore")
    soup = BeautifulSoup(html, "lxml")
    art = soup.select_one("article.notion-root") or soup.select_one(".super-content .notion-root")
    if not art:
        # 2022-era database pages render the collection directly inside .super-content;
        # add the trailing empty text block the custom CSS expects to hide (`.notion-root > div:last-child`)
        art = soup.select_one(".super-content")
        if art is not None:
            art.append(soup.new_tag("div", attrs={"class": "notion-text"}))
    if not art:
        return None, f"no article: {slug}"
    rec_file = records_dir / f"{slug}.json"
    rec = json.load(open(rec_file)) if rec_file.exists() else {}
    blocks = (rec.get("records") or {}).get("block") or {}
    meta = page_meta(soup, rec, slug, path)
    body = process_article(art, blocks, soup)
    inner = "".join(str(c) for c in body.contents)
    text = body.get_text(" ", strip=True)
    if "orbit-reviewarea" in inner:
        meta["needs_orbit"] = True
    if "twitter-tweet" in inner:
        meta["needs_twitter"] = True
    # destination
    rel = path.strip("/")
    if path in section_paths:
        dst = out_dir / rel / "_index.html"
    else:
        dst = out_dir / (rel + ".html")
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(front_matter(meta) + inner + "\n")
    return dst, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--crawl", required=True, help="dir with <slug>.html from the live site")
    ap.add_argument("--records", required=True, help="dir with <slug>.json extracted from the flight payload")
    ap.add_argument("--fallback", help="dir with <slug>.html fetched from the Wayback Machine for pages the live site no longer serves")
    ap.add_argument("--out", default=str(HERE.parent / "content"))
    args = ap.parse_args()
    out_dir = pathlib.Path(args.out)
    records_dir = pathlib.Path(args.records)
    sources = {}
    for f in sorted(glob.glob(f"{args.crawl}/*.html")):
        p = pathlib.Path(f)
        if "__next_error__" in p.read_text(errors="ignore")[:400]:
            continue
        sources[p.stem] = p
    if args.fallback:
        for f in sorted(glob.glob(f"{args.fallback}/*.html")):
            p = pathlib.Path(f)
            txt = p.read_text(errors="ignore")
            if p.stem not in sources and ('class="notion-root' in txt or 'class="super-content' in txt):
                sources[p.stem] = p
    sources.pop("index", None)
    paths = {"/" + s.replace("_", "/") for s in sources}
    section_paths = {p for p in paths if any(o.startswith(p + "/") for o in paths)}
    ok, errors = 0, []
    for slug, p in sources.items():
        dst, err = convert(p, records_dir, out_dir, section_paths)
        if err:
            errors.append(err)
        else:
            ok += 1
    print(f"converted {ok} pages, {len(errors)} errors")
    for e in errors:
        print("  ", e)


if __name__ == "__main__":
    main()
