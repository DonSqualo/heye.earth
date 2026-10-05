#!/usr/bin/env python3
"""Deploy the built site to Netlify through its REST API (no CLI needed).

    tools/netlify_deploy.py --dir public [--site heye-earth] [--prod] [--domain heye.earth]

Token: NETLIFY_AUTH_TOKEN env var or ~/.config/netlify/token (a personal access token
from app.netlify.com → User settings → Applications).

Flow (Netlify "file digest" deploy): send a manifest {path: sha1}, Netlify answers with
the digests it does not have yet, we upload only those files, then poll until the
deploy is ready. --domain sets the site's custom domain (and www alias) once the site
exists; the DNS records themselves have to be changed at the registrar.
"""
import argparse, hashlib, json, os, pathlib, sys, time
import requests

API = "https://api.netlify.com/api/v1"

def token():
    t = os.environ.get("NETLIFY_AUTH_TOKEN")
    if not t:
        f = pathlib.Path.home() / ".config/netlify/token"
        if f.exists():
            t = f.read_text().strip()
    if not t:
        sys.exit("No Netlify token: set NETLIFY_AUTH_TOKEN or write it to ~/.config/netlify/token")
    return t

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="public")
    ap.add_argument("--site", default="heye-earth", help="site name (subdomain of netlify.app)")
    ap.add_argument("--prod", action="store_true", help="production deploy (default: draft deploy with its own URL)")
    ap.add_argument("--domain", help="custom domain to attach, e.g. heye.earth (adds www. alias)")
    ap.add_argument("--title", default="heye.earth static build")
    args = ap.parse_args()
    s = requests.Session()
    s.headers["Authorization"] = f"Bearer {token()}"

    me = s.get(f"{API}/user").json()
    print("account:", me.get("email"), me.get("full_name"))

    # find or create the site
    site = None
    for st in s.get(f"{API}/sites", params={"per_page": 100}).json():
        if st.get("name") == args.site or st.get("custom_domain") == args.domain:
            site = st; break
    if site is None:
        r = s.post(f"{API}/sites", json={"name": args.site})
        r.raise_for_status(); site = r.json()
        print("created site", site["name"], site["url"])
    else:
        print("site", site["name"], site["url"], "| custom domain:", site.get("custom_domain"))
    sid = site["id"]

    if args.domain and site.get("custom_domain") != args.domain:
        r = s.patch(f"{API}/sites/{sid}", json={"custom_domain": args.domain, "domain_aliases": [f"www.{args.domain}"]})
        if r.ok:
            print("custom domain set:", args.domain, "+ www")
        else:
            print("could not set custom domain:", r.status_code, r.text[:300])

    # manifest
    root = pathlib.Path(args.dir)
    files = {}
    digests = {}
    for p in root.rglob("*"):
        if p.is_file():
            rel = "/" + p.relative_to(root).as_posix()
            h = hashlib.sha1(p.read_bytes()).hexdigest()
            files[rel] = h
            digests.setdefault(h, p)
    print(f"{len(files)} files, {sum(p.stat().st_size for p in digests.values()) / 1e6:.0f} MB")
    r = s.post(f"{API}/sites/{sid}/deploys", json={"files": files, "draft": not args.prod, "title": args.title})
    r.raise_for_status(); dep = r.json()
    did = dep["id"]
    required = dep.get("required") or []
    print("deploy", did, "| files to upload:", len(required))
    for i, h in enumerate(required, 1):
        p = digests[h]
        rel = "/" + p.relative_to(root).as_posix()
        for attempt in range(3):
            up = s.put(f"{API}/deploys/{did}/files{requests.utils.quote(rel)}", data=p.read_bytes(), headers={"Content-Type": "application/octet-stream"})
            if up.ok:
                break
            time.sleep(2)
        else:
            print("upload failed", rel, up.status_code, up.text[:200])
        if i % 25 == 0 or i == len(required):
            print(f"  {i}/{len(required)}", flush=True)
    # wait until processed
    for _ in range(120):
        d = s.get(f"{API}/deploys/{did}").json()
        if d.get("state") in ("ready", "error"):
            break
        time.sleep(3)
    print("state:", d.get("state"))
    print("deploy url:", d.get("deploy_ssl_url") or d.get("deploy_url"))
    if args.prod:
        print("site url:", d.get("ssl_url") or d.get("url"))
    if d.get("state") == "error":
        print(d.get("error_message"))
        sys.exit(1)

if __name__ == "__main__":
    main()
