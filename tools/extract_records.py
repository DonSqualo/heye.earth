#!/usr/bin/env python3
"""Extract the Notion record map + head metadata that super.so embeds in each crawled
page (React flight payload for the 2024+ renderer, __NEXT_DATA__ for the older one).

    tools/extract_records.py --crawl DIR --out DIR
Writes <slug>.json with {"records": {...}, "head": {...}, "pageId": ..., "pageLocation": ...}.
"""
import argparse, glob, json, pathlib, re

dec = json.JSONDecoder()

def flight_of(html):
    chunks = re.findall(r'self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)', html)
    return "".join(json.loads('"' + c + '"') for c in chunks)

def trows(flight):
    rows = {}
    for m in re.finditer(r'(?<![0-9a-f])([0-9a-f]{1,3}):T([0-9a-f]+),', flight):
        ln = int(m.group(2), 16)
        rows[m.group(1)] = flight[m.end():m.end() + ln]
    return rows

def resolve(o, rows):
    if isinstance(o, str) and re.match(r'^\$[0-9a-f]+$', o) and o[1:] in rows:
        return rows[o[1:]]
    if isinstance(o, dict):
        return {k: resolve(v, rows) for k, v in o.items()}
    if isinstance(o, list):
        return [resolve(v, rows) for v in o]
    return o

def from_flight(html):
    flight = flight_of(html)
    if not flight:
        return None
    rows = trows(flight)
    out = {}
    for key in ("records", "head"):
        m = re.search(r'"%s":\{' % key, flight)
        if m:
            obj, _ = dec.raw_decode(flight[m.start() + len(key) + 3:])
            out[key] = resolve(obj, rows)
    for key in ("pageId", "pageLocation"):
        m = re.search(r'"%s":"([^"]+)"' % key, flight)
        if m:
            out[key] = m.group(1)
    return out

def from_next_data(html):
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not m:
        return None
    pp = json.loads(m.group(1)).get("props", {}).get("pageProps", {})
    return {k: pp[k] for k in ("records", "head", "pageId", "pageLocation") if k in pp}

ap = argparse.ArgumentParser()
ap.add_argument("--crawl", required=True)
ap.add_argument("--out", required=True)
args = ap.parse_args()
out = pathlib.Path(args.out); out.mkdir(parents=True, exist_ok=True)
n = 0
for f in sorted(glob.glob(f"{args.crawl}/*.html")):
    html = open(f, errors="ignore").read()
    if "__next_error__" in html[:400]:
        continue
    data = from_flight(html) or from_next_data(html)
    if not data:
        continue
    (out / f"{pathlib.Path(f).stem}.json").write_text(json.dumps(data, indent=1, ensure_ascii=False))
    n += 1
print("records written:", n)
