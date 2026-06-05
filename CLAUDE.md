# CLAUDE.md

This file guides Claude Code (claude.ai/code) when working in this repository.

## Project Identity

**Mille Bornes v8.22.1 — « Édition Bagley »** — a desktop **Electron** implementation of the
French card racing game *Mille Bornes*. Modes: solo vs AI, local hotseat, **LAN / Hamachi
multiplayer** (authoritative TCP host + TCP clients), and a **mobile phone companion** (private
hand on a phone over HTTP). Multiple visual universes/themes, vehicles, shops, random events.

The codebase is **French** (UI strings, comments, commit context). Keep that convention.

The game still runs from a single monolith **`index.html`** (~8 000 lines): React 18 + Babel
Standalone, JSX transformed in-browser inside `<script type="text/babel">`. React/ReactDOM/Babel
are **vendored locally** under `assets/` so the packaged `.exe` works fully offline (the CDN
`<script>` fallbacks are commented out — only re-enable for pure-browser debugging).

An **incremental modular migration** is underway: pure logic is being extracted out of the
monolith into a layered `src/` tree, branch by branch, without breaking the running game.

## How to run / build / test

```powershell
npm start              # electron .  → opens index.html in a maximized BrowserWindow
npm run build          # electron-builder --win  → portable .exe in dist/
npm run test:e2e       # playwright test  (all tests/*.spec.js)
npm run arch:check     # node scripts/architecture/check-module-boundaries.cjs
```

- **Electron entry**: `main.js` creates the `BrowserWindow` with `nodeIntegration:true` +
  `contextIsolation:false`. This is deliberate: the renderer (`index.html`) `require()`s Node
  modules directly (`server.js`, `netclient.js`, `netinfo.js`, and extracted `src/` adapters).
  Acceptable for a local desktop app; there is **no preload bridge**.
- **Pure-browser run** (no Electron): the game still loads. Every Node-dependent feature is behind
  a `typeof require === 'function'` guard and falls back to a no-op / legacy path (see below).
- Run a **single** Playwright test while iterating: `npx playwright test tests/apply-self.spec.js`.

## Repository layout

| Path | Role |
|------|------|
| `index.html` | The running game — monolith being progressively emptied into `src/`. |
| `main.js` | Electron main process. |
| `server.js` | Authoritative **TCP host** + **HTTP mobile companion**. Line-delimited JSON protocol. |
| `netclient.js` | TCP client (joins a host). |
| `netinfo.js` | Local IP detection, **Hamachi-priority** sorting. |
| `server.pre-v871-v2-mobile.js` | Legacy server backup — **not loaded**, reference only. |
| `playwright.config.js` | Test runner config (`testDir: ./tests`, headless). |
| `src/` | Target modular architecture (layered, boundary-enforced). |
| `tests/` | Playwright specs: per-module unit-style + `qa.spec.js` (E2E) + `architecture.spec.js`. |
| `docs/architecture/` | Migration contracts & ledgers (see below). |
| `scripts/architecture/check-module-boundaries.cjs` | Import-boundary linter. |
| `assets/` | Vendored React/ReactDOM/Babel + media. |
| `audit-memory/` | AuditSupreme run artifacts (plans, fix history, rollback). |

**Stale / ignore**: `AGENTS.md`, `MEMORY-4.md`, `ROADMAP-5.md` describe a *different* project
(« Conquête » / Conquistador, a strategy game) — they do **not** apply here. Several 0-byte stray
files exist in the repo root (`p`, `host`, `{,`, `el.offsetParent`, `m.playerId))`, …) from
accidental shell redirects; safe to delete.

## Modular architecture (`src/`)

The migration target and rules live in `docs/architecture/` and are **machine-enforced** by
`src/architecture/module-boundaries.json` + `check-module-boundaries.cjs` + `architecture.spec.js`.

### Layers and allowed imports

Dependencies flow **one direction only** (a layer may only import from those listed):

| Layer | `path` | May import |
|-------|--------|-----------|
| `shared` | `src/shared` | — (nothing) |
| `core` | `src/core` | shared |
| `entities` | `src/entities` | core, shared, themes |
| `features` | `src/features` | core, entities, shared, themes |
| `widgets` | `src/widgets` | core, entities, features, shared, themes |
| `pages` | `src/pages` | + widgets |
| `app` | `src/app` | + pages |
| `themes` | `src/themes` | shared, entities |
| `electron` | `src/electron` | app, core, shared |

**Forbidden anywhere in `src/`**: deep relative escapes `../../../` and importing `index.html`.
`core` knows nothing about React; `entities` = domain data + operations; `features` = one feature's
logic/UI; `shared` = game-agnostic utilities.

### Currently extracted modules

```
src/core/game/progression/target-distance.js     # configurable race length
src/core/game/difficulty/difficulty.data.js       # AI difficulty knobs
src/core/game/scoring/calc-score.js               # Mille Bornes scoring
src/entities/cards/card-normalizer.js
src/entities/cards/data/build-deck.js
src/entities/cards/descriptions/{card-copy,humanize-card-value}.js
src/entities/cards/effects/{apply-self,apply-attack,apply-action}.js   # card play rules
src/entities/cards/targeting/card-targeting.js
src/entities/players/player-factory.js
src/entities/vehicles/{vehicle-filter, data/vehicles.data}.js
src/features/deck-discard/deck-actions.js          # draw / discard / recycle
src/features/player-layout-v2/player-slots.js
src/features/progress-road/v2-road-geometry.js
src/features/game-runtime/process-play-adapter.js          # play-flow seam (mapping)
src/features/game-runtime/process-play-self-adapter.js     # EXT-020: self-card play seam
src/features/game-runtime/played-card-consumption.js       # consume played card from hand/deck
```

Every module has a matching `tests/<name>.spec.js`. Modules use CommonJS (`require`/`module.exports`).

### Extraction pattern (EXT-NNN)

Each extraction follows the same safe sequence (see `EXTRACTION_LEDGER.md` / `EXTRACTION_ROADMAP.md`):

1. Create the target module in `src/` (pure logic, no DOM/React in `core`/`entities`).
2. Copy/adapt the logic out of `index.html`; add a `tests/*.spec.js`.
3. Wire the monolith through an **environment-aware adapter** — a guarded IIFE that `require()`s
   the module only when available and **falls back to the legacy path otherwise**. Examples in
   `index.html`: `NetLayer` (line ~4350) and `RuntimeSelfLayer` (EXT-020, line ~4373):

   ```js
   const RuntimeSelfLayer = (() => {
     let selfAdapter = null, available = false;
     try {
       if (typeof require === 'function') {
         selfAdapter = require('./src/features/game-runtime/process-play-self-adapter.js');
         available = !!selfAdapter?.resolveSelfCardPlay;
       }
     } catch (e) { /* fallback legacy actif */ }
     return { available, resolveSelfCardPlay: selfAdapter?.resolveSelfCardPlay || null, /* … */ };
   })();
   ```
4. Only delete the legacy block **after** behavior parity is validated
   (`tests/apply-self-parity.spec.js` is an example parity guard).

`docs/architecture/`: `ARCHITECTURE.md` (target tree), `MODULE_BOUNDARIES.md`,
`EXTRACTION_LEDGER.md`, `EXTRACTION_ROADMAP.md`, `MIGRATION_PLAN.md`, `PROCESS_PLAY_MAP.md`
(the play-flow seams), `ROLLBACK.md`, `VALIDATION_MATRIX.md`.

## Network multiplayer (`server.js`)

- **Authoritative host**: one machine runs `createServer(...)` (native `net` TCP, default port
  **7891**). Clients connect over TCP; protocol is **one JSON object per line** (`\n`-delimited).
- **Mobile companion**: an HTTP server on `port+1` serves a phone a *sanitized private state* and
  accepts actions; actions are queued and drained by the Electron host.
- Client→server: `hello` / `action` / `ping`. Server→clients: `welcome` / `roster` / `state` /
  `start` / `pong` / `error`.
- **Security**: `playerId` is **not trusted from the wire** — the host validates that an action's
  declared player belongs to the sending connection (SEC-02 patch). Keep this when touching
  `handleClientMessage`: never let a peer act as an arbitrary `playerId`.
- Remote/mobile actions are **turn-gated and target-validated** before applying, then the result is
  pushed back to the originating device.

## Core game rules (in the extracted effects modules + monolith)

- **`apply-self`** — playing a card on yourself: can't move while `stopped`/hazarded, distance > 50
  forbidden under `speedLimit`, total ≤ `targetKm`, `feu_vert` only when blocked, remedies only
  against the matching hazard. Returns `{ ok, msg, player? }`.
- **`apply-attack`** — respects botte immunity (`isImmune`); `limite` sets `speedLimit`, others set
  `hazard`. **`apply-action`** — action/zone/chaos cards.
- Players are **cloned, not mutated** — preserve the clone-on-write pattern or React re-renders and
  Win/PassScreen transitions break.
- `stopped:true` is a player's default — moving without `feu_vert` (or `prioritaire`) is the classic
  subtle bug. **`prioritaire` is a triple-clear**: removes `stopped`, clears `hazard`, unsets
  `speedLimit` — do all three.
- `target-distance` makes the finish line configurable; never reintroduce a hardcoded `1000`.

## Conventions & gotchas

- **Version sync is tested.** `architecture.spec.js` asserts `index.html` contains
  `const VERSION="<pkg.version>"` **and** `Mille Bornes v<pkg.version>`. Bump `package.json`,
  `index.html` `<title>`, and the `VERSION` constant together (per the auto-versioning rule).
- **Run `npm run arch:check` after any `src/` import change** — boundary violations fail the build.
- **`require()` is renderer-only and must stay guarded.** Anything using Node (`server`, `net`,
  `src/` adapters) goes behind `typeof require === 'function'` with a legacy fallback, so the game
  never crashes in a plain browser.
- **No build step for the game itself** — `index.html` is shipped as-is and Babel transforms JSX at
  load. Keep the top-of-file data/config blocks pure (no JSX/hooks) and components small.
- File-size guardrail (global rule): aim to keep individual `src/` modules well under 800 lines;
  split by responsibility. `index.html` is the known exception being actively decomposed.

## Tooling layer (does not affect the game)

- **RuFlo / Claude-Flow** is wired via `.mcp.json` + `.claude-flow/` runtime.
  Check: `npx ruflo@latest init check` · Upgrade hooks: `npx ruflo@latest init upgrade`.
- **AuditSupreme** skill (`/audit-supreme`) — structured multi-agent audit; artifacts land in
  `audit-memory/`. Last run (v7): score 72/100; several findings since patched (SEC-02 playerId
  spoofing, CONF-09/10 drain dedup, PERF-01 offline libs now vendored).
