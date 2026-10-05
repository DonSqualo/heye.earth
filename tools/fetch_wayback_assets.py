#!/usr/bin/env python3
"""For pages recovered from the Wayback Machine, download the images they reference
through the archive as well (the original super.so S3 bucket is gone) and add them
to tools/asset-map.json so import_super.py can rewrite the URLs.

    tools/fetch_wayback_assets.py --pages DIR [--out static/assets]
DIR holds <slug>.html files fetched with the id_ flag plus _report.json ({path: "<ts> ..."}).
"""
import argparse, glob, json, pathlib, re, subprocess, sys, urllib.parse, time
from bs4 import BeautifulSoup

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from assetmap import safe_name  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("--pages", required=True)
ap.add_argument("--out", default=str(HERE.parent / "assets-src"))
args = ap.parse_args()
pages = pathlib.Path(args.pages)
out = pathlib.Path(args.out)
amap_path = HERE / "asset-map.json"
amap = json.load(open(amap_path))
report = json.load(open(pages / "_report.json")) if (pages / "_report.json").exists() else {}

def unwrap(u):
    if u.startswith("/_next/image?"):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(u).query)
        u = q.get("url", [u])[0]
    return u

ok = fail = 0
for f in sorted(glob.glob(str(pages / "*.html"))):
    slug = pathlib.Path(f).stem
    path = "/" + slug.replace("_", "/")
    ts = (report.get(path, "") or "").split(" ")[0]
    if not re.match(r"^\d{14}$", ts):
        ts = "2"  # let the archive pick the closest capture
    soup = BeautifulSoup(open(f, errors="ignore").read(), "lxml")
    urls = set()
    for el in soup.find_all(["img", "source", "video", "link"]):
        for attr in ("src", "href", "poster"):
            u = el.get(attr)
            if not u or u.startswith("data:"):
                continue
            if el.name == "link" and "icon" not in " ".join(el.get("rel", [])):
                continue
            u = unwrap(u)
            if re.match(r"https?://", u) and re.search(r"super-static-assets|notion-static|amazonaws|unsplash|cloudinary|images\.spr\.so", u):
                urls.add(u)
        for u in (el.get("srcset") or "").split(","):
            u = unwrap(u.strip().split(" ")[0])
            if re.match(r"https?://", u):
                urls.add(u)
    for u in sorted(urls):
        if u in amap and (out / amap[u]).exists():
            continue
        rel = safe_name(u)
        dst = out / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        wb = f"https://web.archive.org/web/{ts}im_/{u}"
        r = subprocess.run(["curl", "-sL", "--max-time", "120", "-o", str(dst), "-w", "%{http_code} %{content_type}", wb], capture_output=True, text=True)
        code = r.stdout.split(" ")[0]
        if code == "200" and dst.exists() and dst.stat().st_size > 0 and "text/html" not in r.stdout:
            ctype = r.stdout.split(" ", 1)[1].split(";")[0].strip() if " " in r.stdout else ""
            ext = {"image/png": ".png", "image/jpeg": ".jpg", "image/gif": ".gif", "image/svg+xml": ".svg", "image/webp": ".webp"}.get(ctype)
            if ext and dst.suffix.lower() not in (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"):
                new = dst.with_name(dst.name + ext); dst.rename(new); dst = new; rel = str(dst.relative_to(out))
            amap[u] = rel; ok += 1
            print("ok ", slug, rel)
        else:
            fail += 1
            if dst.exists(): dst.unlink()
            print("FAIL", slug, r.stdout[:40], u[:100])
        time.sleep(0.3)
json.dump(amap, open(amap_path, "w"), indent=1, sort_keys=True)
print("ok", ok, "fail", fail)
