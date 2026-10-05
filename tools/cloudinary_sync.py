#!/usr/bin/env python3
"""Upload the site's assets to Cloudinary and write data/cdn.json, which the theme uses
to swap local /assets/... paths for CDN URLs at build time (params.cdn.enabled).

    tools/cloudinary_sync.py --dir static/assets --folder heye-earth [--workers 4]

Credentials: CLOUDINARY_URL env var (cloudinary://key:secret@cloud) or the file
~/.config/cloudinary/url containing that string.

Delivery URLs:
  raster images  -> image/upload/f_auto,q_auto/<public_id>.<ext>   (best format per browser)
  svg/gif/ico/pdf -> image/upload/<public_id>.<ext>                 (untouched)
  video          -> video/upload/<public_id>.<ext>                  (original encoding)
Uploads are idempotent: an asset that already exists under its public_id is reused.
"""
import argparse, concurrent.futures as cf, json, os, pathlib, re, sys

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent

def load_credentials():
    url = os.environ.get("CLOUDINARY_URL")
    if not url:
        f = pathlib.Path.home() / ".config/cloudinary/url"
        if f.exists():
            url = f.read_text().strip()
    if not url or not url.startswith("cloudinary://"):
        sys.exit("No Cloudinary credentials: set CLOUDINARY_URL or write cloudinary://KEY:SECRET@CLOUD to ~/.config/cloudinary/url")
    os.environ["CLOUDINARY_URL"] = url
    import cloudinary
    cloudinary.config()
    return cloudinary.config().cloud_name

RASTER = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".jfif"}
PLAIN_IMAGE = {".svg", ".gif", ".ico", ".pdf"}
VIDEO = {".mp4", ".webm", ".mov"}

def public_id_for(rel, folder):
    stem = rel.with_suffix("") if rel.suffix.lower() in RASTER | PLAIN_IMAGE | VIDEO else rel
    pid = f"{folder}/{stem.as_posix()}"
    pid = re.sub(r"[^A-Za-z0-9_./-]", "_", pid)
    return re.sub(r"_+", "_", pid)

def delivery_url(cloud, pid, ext, kind):
    ext = ext.lower()
    if kind == "video":
        return f"https://res.cloudinary.com/{cloud}/video/upload/{pid}{ext}"
    if ext in RASTER:
        return f"https://res.cloudinary.com/{cloud}/image/upload/f_auto,q_auto/{pid}{ext}"
    return f"https://res.cloudinary.com/{cloud}/image/upload/{pid}{ext}"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default=str(ROOT / "assets-src"))
    ap.add_argument("--folder", default="heye-earth")
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--out", default=str(ROOT / "data/cdn.json"))
    args = ap.parse_args()
    cloud = load_credentials()
    import cloudinary.uploader, cloudinary.api
    base = pathlib.Path(args.dir)
    files = sorted(p for p in base.rglob("*") if p.is_file())
    out_path = pathlib.Path(args.out)
    existing = json.load(open(out_path)).get("urls", {}) if out_path.exists() else {}
    urls = dict(existing)
    print(f"{len(files)} files, {len(existing)} already mapped")

    def upload(p):
        rel = p.relative_to(base)
        key = "/assets/" + rel.as_posix()
        if key in urls:
            return key, urls[key], "cached"
        ext = p.suffix.lower()
        kind = "video" if ext in VIDEO else "image" if ext in RASTER | PLAIN_IMAGE else "raw"
        pid = public_id_for(rel, args.folder) if kind != "raw" else f"{args.folder}/{rel.as_posix()}"
        try:
            opts = dict(public_id=pid, resource_type=kind, overwrite=False, unique_filename=False,
                        use_filename=False, invalidate=False, timeout=900)
            if p.stat().st_size > 20 * 1024 * 1024:
                # chunked upload for big videos / images (single requests are capped at ~100 MB)
                r = cloudinary.uploader.upload_large(str(p), chunk_size=10 * 1024 * 1024, **opts)
            else:
                r = cloudinary.uploader.upload(str(p), **opts)
            fmt = "." + r["format"] if r.get("format") else ext
            if kind == "raw":
                url = r["secure_url"]
            else:
                url = delivery_url(cloud, r["public_id"], fmt if ext in RASTER else ext, kind)
            return key, url, "ok" if not r.get("existing") else "existing"
        except Exception as e:  # noqa: BLE001
            return key, None, f"FAIL {e}"

    ok = fail = 0
    with cf.ThreadPoolExecutor(args.workers) as ex:
        for i, (key, url, status) in enumerate(ex.map(upload, files), 1):
            if url:
                urls[key] = url; ok += 1
            else:
                fail += 1; print(status, key)
            if i % 25 == 0 or i == len(files):
                print(f"{i}/{len(files)}", flush=True)
                pathlib.Path(args.out).write_text(json.dumps({"cloud": cloud, "folder": args.folder, "urls": dict(sorted(urls.items()))}, indent=1))
    pathlib.Path(args.out).write_text(json.dumps({"cloud": cloud, "folder": args.folder, "urls": dict(sorted(urls.items()))}, indent=1))
    print("ok", ok, "fail", fail, "->", args.out)

if __name__ == "__main__":
    main()
