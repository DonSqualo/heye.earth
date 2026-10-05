#!/usr/bin/env python3
"""Crawl every page listed in the sitemap of a super.so site into DIR/<slug>.html.

    tools/crawl_live.py --site https://heye.earth --out crawl/live
Slugs are the URL path with '/' replaced by '_' ("index" for the home page).
"""
import argparse, pathlib, re, subprocess, time, urllib.request

ap = argparse.ArgumentParser()
ap.add_argument("--site", default="https://heye.earth")
ap.add_argument("--out", required=True)
args = ap.parse_args()
out = pathlib.Path(args.out); out.mkdir(parents=True, exist_ok=True)
xml = urllib.request.urlopen(args.site.rstrip("/") + "/sitemap.xml", timeout=60).read().decode()
urls = re.findall(r"<loc>([^<]+)</loc>", xml)
print("sitemap urls:", len(urls))
for u in urls:
    path = u.replace(args.site.rstrip("/"), "") or "/"
    slug = "index" if path == "/" else path.strip("/").replace("/", "_")
    dst = out / f"{slug}.html"
    if dst.exists() and dst.stat().st_size > 1000:
        continue
    r = subprocess.run(["curl", "-sL", "--max-time", "120", "-o", str(dst), "-w", "%{http_code}", u], capture_output=True, text=True)
    print(r.stdout, path, flush=True)
    time.sleep(0.2)
