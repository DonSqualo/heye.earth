"""Deterministic local file names for remote assets (shared by fetch_assets.py and import_super.py)."""
import hashlib, pathlib, re, urllib.parse


def safe_name(url):
    u = urllib.parse.urlparse(url)
    host = u.netloc
    path = urllib.parse.unquote(u.path)
    # images.spr.so (super.so's image CDN): .../<id>/<name>/<variant>  -> keep id + name, drop variant
    if host == "images.spr.so":
        m = re.match(r"/cdn-cgi/imagedelivery/[^/]+/([0-9a-f-]+)/(.*?)(?:/(?:public|w=\d+[^/]*))?/?$", path)
        if m:
            name = m.group(2).split("/")[-1][:80]
            return f"spr/{m.group(1)[:8]}-{re.sub(r'[^A-Za-z0-9._-]', '_', name)}"
    if host == "assets.super.so":
        parts = path.strip("/").split("/")
        return "super/" + "-".join(parts[-2:])[:120].replace(" ", "_")
    if host == "res.cloudinary.com":
        m = re.search(r"/v\d+/(.*)$", path)
        tail = m.group(1) if m else path.strip("/")
        return "cloudinary/" + re.sub(r"[^A-Za-z0-9._/-]", "_", tail)
    if host == "images.unsplash.com":
        q = urllib.parse.parse_qs(u.query)
        pid = path.strip("/").replace("/", "_")
        w = q.get("w", ["0"])[0]
        return f"unsplash/{pid}-w{w}.jpg"
    if host in ("app.notion.com", "www.notion.so"):
        inner = urllib.parse.unquote(path.split("/image/", 1)[1]) if "/image/" in path else path
        inner = inner.split("?")[0]
        return "notion/" + re.sub(r"[^A-Za-z0-9._-]", "_", inner.split("/")[-1])[:100]
    h = hashlib.sha1(url.encode()).hexdigest()[:10]
    ext = re.sub(r"[^A-Za-z0-9.]", "", pathlib.Path(path).suffix.split("?")[0])[:6]
    return f"other/{host.replace('.', '_')}-{h}{ext}"
