---
title: "Import in Obsidian"
tags:
  - meta
  - import-guide
---

# So importierst du diese Notes in Obsidian

Die komplette Mappe `Planum-Sticker-Variante-C/` ist als Obsidian-Subfolder strukturiert:

- 1× Index-Note (`Variante C — Stil-Übersicht.md`)
- 12× Varianten-Notes (`C1 — Classic.md` … `C12 — Minimal.md`)
- 24× Attachments in `attachments/` (12 PNG + 12 SVG)
- Yaml-Frontmatter, Wikilinks zwischen Notes, eingebettete Bilder mit Größenangabe

## Variante 1 — Drag & Drop in deinen Vault

1. Öffne im Finder den Ordner `~/Developer/planum/obsidian/Planum-Sticker-Variante-C/`
2. Ziehe den **kompletten Ordner** in den File-Explorer deines Obsidian-Vaults
3. Öffne `Variante C — Stil-Übersicht.md` als Einstiegspunkt — alle Wikilinks funktionieren sofort

## Variante 2 — Symlink (mein Favorit für Solo-Devs)

Damit Änderungen aus dem Repo automatisch in Obsidian erscheinen:

```bash
# In deinem Obsidian-Vault-Verzeichnis:
ln -s ~/Developer/planum/obsidian/Planum-Sticker-Variante-C ./Planum-Sticker-Variante-C
```

Vorteil: bei `git pull` auf einem anderen Gerät sind die Notes auch dort aktuell.

> [!warning] iCloud + Symlinks
> Wenn dein Vault in iCloud liegt, funktionieren Symlinks unzuverlässig. Dann lieber **Variante 1** oder den Ordner direkt im Vault halten.

## Frontmatter-Tag-Konvention

| Tag | Bedeutung |
|---|---|
| `planum` | Projekt-Filter |
| `sticker` | Sub-Domain Hardware |
| `qr` | QR-bezogene Notes |
| `primary-candidate` | Kandidat für Hauptlinie (C1, C2, C4, C5) |
| `seasonal` | Saison-Edition (C3, C6, C9) |
| `premium` | Premium-Pricing (C4, C8) |
| `experimental` | Vor Roll-out testen (C6, C8, C11) |

Filter via Obsidian Search: `tag:#primary-candidate` oder per Dataview-Query.

## Optionaler Dataview-Block

Wenn du das Plugin aktiviert hast — diesen Block in die Index-Note packen:

````markdown
```dataview
TABLE variant, scan_validated, file.tags as Tags
FROM "Planum-Sticker-Variante-C"
WHERE variant
SORT variant
```
````
