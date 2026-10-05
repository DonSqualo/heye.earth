#!/usr/bin/env python3
"""Download every external asset referenced by crawled pages into static/assets and
record URL -> local path in tools/asset-map.json (idempotent).

    tools/fetch_assets.py --crawl DIR [--extra urls.txt]
"""
import argparse, concurrent.futures as cf, glob, json, pathlib, re, subprocess, sys, time, urllib.parse
from bs4 import BeautifulSoup

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from assetmap import safe_name  # noqa: E402

OUT = HERE.parent / "assets-src"   # originals; served from Cloudinary (tools/cloudinary_sync.py) or copied to static/assets
MAP = HERE / "asset-map.json"
EXTS = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".mp4", ".webm", ".ico", ".pdf", ".avif", ".jfif", ".mov")
CTYPE_EXT = {"image/png": ".png", "image/jpeg": ".jpg", "image/gif": ".gif", "image/svg+xml": ".svg", "image/webp": ".webp", "video/mp4": ".mp4", "video/webm": ".webm", "image/x-icon": ".ico", "image/vnd.microsoft.icon": ".ico", "application/pdf": ".pdf", "image/avif": ".avif"}

def collect(crawl):
    urls = set()
    for f in glob.glob(f"{crawl}/*.html"):
        html = open(f, errors="ignore").read()
        if "__next_error__" in html[:400]:
            continue
        soup = BeautifulSoup(html, "lxml")
        for el in soup.find_all(["img", "video", "source", "audio", "link"]):
            u = el.get("src") or el.get("href") or el.get("poster")
            if not u or u.startswith("data:"):
                continue
            if el.name == "link" and "icon" not in " ".join(el.get("rel", [])):
                continue
            if u.startswith("/_next/image?url="):
                u = urllib.parse.unquote(u.split("url=", 1)[1].split("&")[0])
            if re.match(r"https?://", u):
                urls.add(u)
    return urls

def fetch(url, amap):
    if url in amap and (OUT / amap[url]).exists():
        return url, amap[url], "cached"
    rel = safe_name(url)
    dst = OUT / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    get = url
    if "images.spr.so" in url:
        get = re.sub(r"/(?:public|w=\d+[^/]*)/?$", "/w=3840,quality=95,fit=scale-down", url)
    if "images.unsplash.com" in url:
        get = re.sub(r"[&?]w=\d+", "", url) + "&w=2400"
    for attempt in range(3):
        r = subprocess.run(["curl", "-sL", "--max-time", "120", "-A", "Mozilla/5.0", "-o", str(dst), "-w", "%{http_code} %{content_type}", get], capture_output=True, text=True)
        code = r.stdout.split(" ")[0]
        if code == "200" and dst.exists() and dst.stat().st_size > 0:
            ctype = r.stdout.split(" ", 1)[1] if " " in r.stdout else ""
            if dst.suffix.lower() not in EXTS:
                ext = CTYPE_EXT.get(ctype.split(";")[0].strip())
                if ext:
                    new = dst.with_name(dst.name + ext); dst.rename(new); dst = new; rel = str(dst.relative_to(OUT))
            return url, rel, "ok"
        if get != url and attempt == 1:
            get = url
        time.sleep(2)
    return url, None, f"fail {r.stdout}"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--crawl", required=True)
    ap.add_argument("--extra", help="text file with one additional URL per line")
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    amap = json.load(open(MAP)) if MAP.exists() else {}
    urls = collect(args.crawl)
    if args.extra:
        urls |= {l.strip() for l in open(args.extra) if l.strip()}
    urls = sorted(urls)
    print("urls:", len(urls))
    ok = fail = 0
    with cf.ThreadPoolExecutor(8) as ex:
        for url, rel, status in ex.map(lambda u: fetch(u, amap), urls):
            if rel:
                amap[url] = rel; ok += 1
            else:
                fail += 1; print("FAIL", status, url[:140])
    MAP.write_text(json.dumps(amap, indent=1, sort_keys=True))
    print("ok", ok, "fail", fail)

if __name__ == "__main__":
    main()
