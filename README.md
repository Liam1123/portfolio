# LIAMDEX

Liam Mahone's portfolio as a first-generation Pokédex. A low-res 3D Pokédex spins on a pixel-art Alola beach; tap it and it opens like a book while the camera zooms in, revealing the dex UI.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | Where |
| --- | --- |
| All résumé content (moves, badges, party…) | `src/data/dex.ts` |
| 3D Pokédex model + open animation (react-three-fiber) | `src/components/PokedexScene.tsx` |
| Alola beach background (canvas pixel art) | `src/components/AlolaBackground.tsx` |
| Dex UI shell (Radix Tabs keypad, D-pad, screens) | `src/components/DexUI.tsx` |
| Section screens | `src/components/DexSections.tsx` |
| Local SQLite DB (`data/liamdex.db`, auto-created) | `src/lib/db.ts` |

## API (Next.js route handlers)

- `GET /api/dex` — all résumé data as JSON (static)
- `GET|POST /api/guestbook` — trainer log entries (SQLite, rate-limited, zod-validated)
- `GET|POST /api/encounters` — "SEEN" counter for how many times the dex was opened

## Deep links

`/#entry`, `/#moves`, `/#powers`, `/#badges`, `/#training`, `/#party`, `/#pc` skip the intro and open straight to that page. In the dex, keys 1–7 jump between pages and Esc closes it.
