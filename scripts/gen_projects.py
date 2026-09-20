#!/usr/bin/env python3
"""Generate src/data/projects.js for the BEST website from the extracted source data."""
import json, os, re, unicodedata, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import overrides as OV

ROOT = sys.argv[1]
CORE = os.path.join(ROOT, "public/core_data")
IMGDIR = os.path.join(CORE, "BEST/List of projects to be showcased")
WEBIMG = "/core_data/BEST/List of projects to be showcased/"

data = json.load(open(os.path.join(CORE, "core_consult_data.json"), encoding="utf-8"))

# ---------------------------------------------------------------- images
files = [f for f in os.listdir(IMGDIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
by_no = {}
for f in files:
    m = re.match(r"^\s*(\d+)", f)
    if not m:
        continue
    by_no.setdefault(int(m.group(1)), []).append(f)

def sort_key(f):
    m = re.match(r"^\s*(\d+)(?:[.\-](\d+))?", f)
    return (int(m.group(1)), int(m.group(2) or 0), f)

for k in by_no:
    by_no[k].sort(key=sort_key)

# ---------------------------------------------------------------- helpers
def clean(s):
    s = unicodedata.normalize("NFKC", s or "")
    s = s.replace("‐", "-").replace("‑", "-").replace("‒", "-")
    s = s.replace("–", "-").replace("—", "-").replace("‘", "'")
    s = s.replace("’", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).strip()

SMALL = {"at", "of", "on", "in", "the", "for", "and", "to", "&", "a"}
KEEP = {"BEST", "UAE", "RAK", "JVC", "TECOM", "MRO", "HSE", "AoR", "AOR", "DWC",
        "DIC", "JLT", "JVT", "PMC", "LLC", "DM", "VIP", "FBO", "GEMS", "OTE",
        "SATYS", "STTS", "DC", "MAG", "GEW", "VKL", "II", "III"}

def titlecase(s):
    words = s.split()
    out = []
    for i, w in enumerate(words):
        bare = re.sub(r"[^A-Za-z&]", "", w)
        if bare.upper() in KEEP:
            out.append(w.upper() if bare.isupper() or bare.upper() in KEEP else w)
        elif w.isupper() and len(bare) > 1:
            lw = w.lower()
            out.append(lw if (i and lw in SMALL) else lw.capitalize())
        elif w.isupper():
            out.append(w)
        else:
            out.append(w if any(c.isupper() for c in w[1:]) else (w.lower() if (i and w.lower() in SMALL) else w[:1].upper() + w[1:]))
    return " ".join(out)

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return re.sub(r"-{2,}", "-", s)

SPEC_RE = re.compile(r"^[0-9]*\s*[BGPMR](?:\s*\+\s*[0-9A-Za-z ]+)+", re.I)

ARCH_KEYS = [
    "architectural design", "architecture design", "architectural design",
    "concept architecture", "lead consultant", "lead consul tant",
    "architecture", "architect", "original consultant", "original design",
    "owner", "master developer", "design & build contractor", "contractor",
    "employer", "operator", "asset owner",
]
SCOPE_KEYS = ["best scope", "best sc ope", "scope", "structural design",
              "structural designer", "structure", "structural & aor"]

def parse_details(details):
    """Split the raw detail blob into spec / credits / scope / notes."""
    spec, credits, scope, notes = None, [], [], []
    seen = set()
    raw = (details or "").replace("\r", "")
    lines = [clean(l) for l in re.split(r"[\n;]+", raw)]
    for line in lines:
        if not line or line.lower() in seen:
            continue
        seen.add(line.lower())
        if spec is None and SPEC_RE.match(line) and "+" in line:
            spec = re.sub(r"\s+[A-Za-z]$", "", line.rstrip(".,"))
            continue
        m = re.match(r"^([A-Za-z&/ .()-]{3,40}?)\s*[:\-]\s*(.+)$", line)
        if m:
            key, val = clean(m.group(1)), clean(m.group(2))
            kl = key.lower().replace(" ", " ")
            val = val.rstrip(".,")
            if not val:
                continue
            key = re.sub(r"^(Dubai|UAE|India)\s+(?=[A-Za-z])", "", key, flags=re.I)
            label = titlecase(key)
            label = (label.replace("Consul Tant", "Consultant")
                          .replace("Aor", "AoR").replace("Sc Ope", "Scope"))
            entry = {"label": label, "value": val}
            if any(k in kl for k in SCOPE_KEYS) and ("best" in kl or "scope" in kl):
                if val.upper() != "BEST":
                    scope.append(entry)
                continue
            if any(k in kl for k in ARCH_KEYS) or "design" in kl or "consult" in kl:
                credits.append(entry)
                continue
            credits.append(entry)
            continue
        if re.fullmatch(r"(BEST\s*)?(SCOPE|Scope)", line, re.I):
            continue
        if len(line) > 3:
            notes.append(line)
    # de-duplicate credits by label
    seenl, ded = set(), []
    for c in credits:
        k = (c["label"].lower(), c["value"].lower())
        if k in seenl:
            continue
        seenl.add(k)
        ded.append(c)
    return spec, ded, scope, notes

# ---------------------------------------------------------------- build
CATEGORY_ORDER = [
    "High-Rise & Towers", "Hospitality & Hotels", "Commercial & Corporate",
    "Luxury Residential & Villas", "Aviation & Hangars",
    "Educational & Institutional", "Industrial & Manufacturing",
]

projects = []
for p in data["projects"]:
    sl = p.get("slNo")
    if sl in OV.DROP:
        continue
    title = OV.TITLES.get(sl) or titlecase(clean(p["title"]))
    loc = OV.LOCATIONS.get(sl) or clean(p.get("location", ""))
    imgs = [WEBIMG + f for f in by_no.get(sl, [])]
    if not imgs:
        prim = p.get("primaryImage")
        imgs = [prim] if prim else []
    spec, credits, scope, notes = parse_details(p.get("details"))
    if sl in OV.SPECS:
        spec = OV.SPECS[sl]
    if sl in OV.FACTS:
        facts = [{"label": l, "value": v} for l, v in OV.FACTS[sl]]
        scope = [f for f in facts if "scope" in f["label"].lower()] or scope
        credits = [f for f in facts if "scope" not in f["label"].lower()]
        notes = []
    services = [clean(s) for s in p.get("services", []) if clean(s)]
    if not scope and services:
        scope = [{"label": "BEST Scope", "value": ", ".join(services)}]
    parts = [clean(x) for x in loc.split(",") if clean(x)]
    city = parts[0] if parts else ""
    country = parts[-1] if parts else ""
    if country.upper() == "UAE":
        country = "UAE"
    projects.append({
        "id": f"p{sl:03d}",
        "slug": slugify(title)[:70],
        "no": sl,
        "title": title,
        "category": p.get("category"),
        "sector": p.get("sector"),
        "location": loc,
        "city": city,
        "country": country or city,
        "emirate": parts[-2] if len(parts) > 2 else (parts[0] if parts else ""),
        "year": p.get("year"),
        "client": p.get("client"),
        "spec": spec,
        "credits": credits,
        "scope": scope,
        "services": services,
        "notes": notes,
        "images": imgs,
        "cover": imgs[0] if imgs else None,
        "featured": bool(p.get("featured")),
        "summary": None,  # filled below
    })

projects.sort(key=lambda x: x["no"])

# one-line summary, built only from facts we actually hold
def summarise(pr):
    bits = []
    if pr["spec"]:
        bits.append(pr["spec"])
    lead = next((c["value"] for c in pr["credits"]
                 if "architect" in c["label"].lower() or "lead" in c["label"].lower()), None)
    sc = pr["scope"][0]["value"] if pr["scope"] else None
    if sc:
        bits.append(f"BEST scope: {sc}")
    if lead and lead.upper() != "BEST":
        bits.append(f"with {lead}")
    return " · ".join(bits) if bits else f"{pr['category']} project in {pr['location']}."

for pr in projects:
    pr["summary"] = summarise(pr)

cats = sorted({p["category"] for p in projects if p["category"]},
              key=lambda c: CATEGORY_ORDER.index(c) if c in CATEGORY_ORDER else 99)
countries = sorted({p["country"] for p in projects if p["country"]})
years = sorted({p["year"] for p in projects if p["year"]})
clients = sorted({p["client"] for p in projects if p["client"] and p["client"] != "Private Client"})

out = os.path.join(ROOT, "src/data/projects.js")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w", encoding="utf-8") as fh:
    fh.write("// AUTO-GENERATED from public/core_data by scripts/gen_projects.py — do not edit by hand.\n")
    fh.write("// Source: BEST company profile + project schedule. Re-run the script to regenerate.\n\n")
    fh.write("export const projects = " + json.dumps(projects, indent=2, ensure_ascii=False) + ";\n\n")
    fh.write("export const categories = " + json.dumps(cats, ensure_ascii=False) + ";\n")
    fh.write("export const countries = " + json.dumps(countries, ensure_ascii=False) + ";\n")
    fh.write("export const years = " + json.dumps(years, ensure_ascii=False) + ";\n")
    fh.write("export const clients = " + json.dumps(clients, ensure_ascii=False) + ";\n\n")
    fh.write("export const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));\n")
    fh.write("export const projectsBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));\n")

print("projects:", len(projects))
print("with images:", sum(1 for p in projects if p["images"]))
print("total images used:", sum(len(p["images"]) for p in projects))
print("categories:", cats)
print("countries:", countries)
print("years:", years)
print("\n--- sample ---")
for p in projects[:2] + [x for x in projects if x["no"] in (27, 46, 51)]:
    print(json.dumps(p, indent=1, ensure_ascii=False)[:900])
    print()
