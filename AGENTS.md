# AGENTS.md — Mémoire opérationnelle du projet

## 1. But du fichier
Ce fichier sert de base de travail à chaque nouvelle conversation. Il permet de comprendre rapidement le projet, d’identifier les bons fichiers à analyser, et de savoir quoi faire automatiquement selon la demande.

## 2. Identité du projet
- Nom : Conquête
- Genre : stratégie au tour par tour, conquête territoriale, gestion de ressources
- Cible : navigateur
- Stack : JavaScript ES Modules, Vite, Express, Socket.IO
- UI : HTML/CSS/SVG, thème militaire sombre

## 3. Sources de vérité
À lire en priorité selon le besoin :
1. `MEMORY-4.md`
2. `ROADMAP-5.md`
3. `design-decisions-3.md`
4. fichier de configuration de carte du thème actif
5. changelog si besoin d’historique technique

## 4. Ordre d’analyse automatique
### Si la demande concerne le gameplay
Lire :
- `MEMORY-4.md`
- `design-decisions-3.md`
- `ROADMAP-5.md`

### Si la demande concerne la carte, l’éditeur ou les territoires
Lire :
- `MEMORY-4.md`
- `ROADMAP-5.md`
- config du thème
- fichier d’assets de carte correspondant

### Si la demande concerne l’UI ou les visuels
Lire :
- `CHANGELOG-2.md`
- `ROADMAP-5.md`
- les fichiers UI concernés

### Si la demande concerne un bug
Lire :
- changelog
- roadmap
- mémoire projet
- config ou fichier ciblé selon le bug

## 5. Règles automatiques
- Identifier la catégorie de la demande avant d’agir.
- Charger en priorité les fichiers de contexte plutôt que modifier au hasard.
- Si la demande touche à la carte, vérifier à la fois la config, le chemin de l’image et l’affichage.
- Si la demande touche à l’éditeur, vérifier la visibilité, la modification et l’adaptation manuelle/automatique.
- Si une option n’est plus utile, la retirer du menu ou de l’interface.
- Si un nom de fichier change, mettre à jour toutes les références.

## 6. Cartes et territoires
- La config de territoire doit être chargée depuis le thème actif.
- Le fichier de config doit suivre un nom standard.
- La carte de fond doit être visible dans l’éditeur et en jeu.
- Les modes d’affichage de la carte doivent être explicites : visible / masquée / modifiable / verrouillée / adaptation manuelle / automatique.

## 7. Démarrage de nouvelle session
Avant toute modification :
1. lire le contexte ;
2. identifier le type de tâche ;
3. choisir les fichiers à analyser ;
4. vérifier les dépendances de la tâche ;
5. proposer ou appliquer la modification la plus cohérente.

## 8. Objectif
Réduire les pertes de contexte entre sessions, accélérer l’analyse, et éviter les corrections incohérentes.

| Type de demande | Fichiers à lire d’abord |
|---|---|
| Gameplay | MEMORY-4.md, design-decisions-3.md, ROADMAP-5.md |
| Carte / territoires | MEMORY-4.md, ROADMAP-5.md, config du thème |
| UI / visuels | CHANGELOG-2.md, ROADMAP-5.md |
| Bugs | CHANGELOG-2.md, MEMORY-4.md, fichier concerné |
| Nouvelles fonctionnalités | ROADMAP-5.md, MEMORY-4.md, design-decisions-3.md |

## 9. RuFlo (orchestration agents)

[RuFlo](https://github.com/ruvnet/ruflo) est branché sur ce dépôt : runtime V3 (`.claude-flow/`), hooks et helpers (`.claude/`), serveur MCP défini dans `.mcp.json` (`ruflo` → `npx ruflo@latest mcp start`).

- Vérifier l’installation : `npx ruflo@latest init check`
- Mettre à jour hooks/helpers sans toucher aux données : `npx ruflo@latest init upgrade`
- Référence amont : [README](https://github.com/ruvnet/ruflo) et [USERGUIDE](https://github.com/ruvnet/ruflo/blob/main/docs/USERGUIDE.md)

---

## Annexe — localisation réelle des sources dans ce dépôt

Le dépôt actuel contient un dossier consolidé `workspace/app/frontend/Docs/` avec un fichier maître `PROJECT-TRACKING.md` qui fusionne **mémoire, roadmap, décisions, changelog, backlog, dette technique**. Les fichiers nommés dans la table ci-dessus sont matérialisés à la racine du projet comme pointeurs vers les sections correspondantes de `PROJECT-TRACKING.md`.

- `MEMORY-4.md` → section « 2. État actuel », « 4. Systèmes déjà fonctionnels », « 9. Dictionnaire » de `PROJECT-TRACKING.md`
- `ROADMAP-5.md` → section « 12. Plan d'action priorisé », « 14-bis. Roadmap gameplay stratégique profond », « 15. Top 10 actions immédiates »
- `CHANGELOG-2.md` → section « 3. Historique des corrections et livraisons majeures »
- `design-decisions-3.md` → section « 13. Règles du projet (garde-fous) »
- Config de carte par thème : `workspace/app/frontend/public/themes/<theme>/territories_config.json`
- Assets de carte : `workspace/app/frontend/public/themes/<theme>/` (PNG/JPG dédiés + `Territoire_1.png`)

### Chemins techniques clés

| Rôle | Chemin |
|---|---|
| Code source | `workspace/app/frontend/src/` |
| Point d'entrée React | `workspace/app/frontend/src/main.tsx` |
| Systèmes de jeu | `workspace/app/frontend/src/systems/` |
| Stores Zustand | `workspace/app/frontend/src/stores/` |
| Thèmes + layouts | `workspace/app/frontend/src/data/themes.ts` |
| Loader carte Nathan | `workspace/app/frontend/src/data/mapConfig.ts` |
| Serveur multi (scaffold) | `workspace/app/frontend/server.cjs` |
| Electron main | `workspace/app/frontend/electron/main.cjs` |
| Menu Windows | `menu.bat` (racine) |
| Build portable | `build-electron-portable.bat` (racine) |
| Dossier build `.exe` | `dist_electron/` |


<claude-mem-context>
# Memory Context

# [Miles_Borne] recent context, 2026-05-20 7:28pm GMT+2

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (20 272t read) | 1 881 119t work | 99% savings

### May 17, 2026
S65 Mille Bornes HTML/React game — comprehensive incremental improvement: bug fixes, shop expansion, new cards, events, animations, UI polish, and audit (May 17, 6:12 PM)
S66 Soft UI/UX redesign of Mille Bornes v8.3.1 (index.html) — 5 targeted modifications applied across menu, lobby, and game interface, followed by non-regression audit (May 17, 7:10 PM)
S67 Miles_Borne UI refactoring — 5-mission overhaul of single-file React app (index.html): compact status zone, eliminate vertical scroll, Lobby solo split, Zoom preview/confirmation workflow, Mission 5 @keyframes animations (May 17, 8:18 PM)
S68 Miles_Borne deep redesign (Tasks 53–57): stacked cards, IA hand overlap, topbar AI chip, neon config title, vehicle showcase, start-cta button — full implementation and audit (May 17, 11:06 PM)
S69 AC themes mega update for Miles_Borne/index.html — full integration of AC Mirage and AC Black Flag themes across all game systems, plus UI/animation polish (May 17, 11:31 PM)
### May 18, 2026
S70 Observer session monitoring Miles_Borne index.html — recording all primary session patches across P4 and P5, tracking task completions through final non-regression audit (May 18, 9:00 AM)
1661 11:18a 🟣 P1: AI Status Badge Refactored to Auto-Width Mini-Badge
1662 11:19a ✅ Task 73 (P1 AI Status Mini-Badge) Marked Completed
1663 11:20a ✅ Task 76 (P2 AI Hand Compact) Started
S71 Mille Bornes v8.3.1 — Task 80 (P2) Shop Queue multi-joueurs + Task 81 (P1) Status Toast : implémentation complète et audit de régression (May 18, 12:02 PM)
1664 12:10p 🟣 Multiplayer NPC/Shop Turn System Refactor + Status Zone UI Redesign Requested
1665 12:11p ✅ Pre-shop-queue Backup Created for index.html
1666 " ⚖️ Implementation Plan Decomposed into Three Tracked Tasks
1667 12:12p 🔴 Status Badge Removed from Draw/Discard Row in index.html
S72 Optimisation layout UI/UX jeu Mille Bornes (index.html) — compacter la zone Pioche/Défausse/IA et remonter la main joueur dans le viewport (May 18, 12:35 PM)
1668 12:48p 🟣 Game UI Layout Optimization — Compact AI Hand, Draw/Discard Piles, and Player Hand Elevation
1669 " ✅ Pre-refactor Backup of index.html Created
1670 " ✅ Three-Task Refactor Plan Created for Mille Bornes Layout Optimization
1671 " 🔵 Drag-and-Drop Uses CSS Class "drag-over-valid" Applied Conditionally in JSX
1672 " 🔵 Center Panel Layout Structure Mapped in index.html
1673 12:49p 🔄 Center Panel Top Row Fully Restructured — Pioche/Défausse Compacted, AI Hand Merged onto Same Row
S73 Phase 5 Card Component Enhancement: Integrate getCardEffect() for concise card effect descriptions and add visual type badges; fix z-index hierarchy, eliminate notification overlaps, and stabilize layout alignment (pioche/défausse, player hand height) (May 18, 12:57 PM)
1674 1:04p ⚖️ Major UI/UX Refactor Requested for Card Game Interface
1675 1:05p ✅ Backup Created Before Z-Index and Cards Refactor
1676 " ⚖️ UI Refactor Decomposed into 6 Tracked Tasks with Clear Specs
1677 1:06p 🟣 CSS Z-Index Hierarchy Implemented as CSS Custom Properties
1678 1:08p 🔵 Hardcoded Z-Index Values Still Present After CSS Variable Introduction
1679 4:57p 🔵 Miles_Borne Project HTML Snapshot Archive Structure
1680 4:58p 🔄 Exit Modal Z-Index Migrated to CSS Custom Property
1681 5:00p 🔵 Remaining Hardcoded Z-Index Values in JSX Inline Styles
1682 5:21p 🔴 Fixed vertical alignment of Pioche+Defausse section in game center panel
1683 5:49p ⚖️ Dual-Axis Refactor Requested: Pioche/Défausse Layout Fix + Local Multiplayer with Hamachi
1684 5:50p 🔵 Project Identified as Miles_Borne (Mille Bornes Card Game) at C:\PROJET\Miles_Borne
1685 " 🔵 Miles_Borne Is an Electron App — Architecture Confirmed Before Refactor
1686 " 🔵 Miles_Borne Architecture Audit: Monolithic 312KB index.html, Minimal main.js, No WebSocket Deps
1687 5:51p 🔵 index.html Game Layout: 4408-Line Monolith with CSS Variable Scale System and Inline React Styles
1688 " 🔵 Pioche/Défausse Overflow Root Cause Found: flexShrink:0 + Double-Transform Défausse Card
1689 5:52p 🔴 Pioche/Défausse Overflow Fixed: Double-Transform Replaced, Overflow Guards Added (AXE 1)
1690 5:55p 🟣 netinfo.js Created: IP Detection Module with Hamachi Priority Sorting
S74 Dual-axis refactor of Mille Bornes (Miles Bornes) Electron project: AXE 1 — fix Pioche/Défausse overflow layout; AXE 2 — add fully functional LAN/Hamachi multiplayer with TCP server, lobby UI, and documentation (May 18, 6:07 PM)
1691 6:21p ⚖️ 4-Priority Refactor Plan for Desktop Card Game (Electron/.exe)
1692 " ✅ Pre-Refactor Backup and Task Tracking Initialized for 4-Priority Fix
1693 " ✅ Task Tracking Completed: P4 Build and Final Audit Tasks Registered
1694 6:22p 🔴 P1 Fixed: Top Bar Clipping — overflow:hidden Replaced with overflow-x:hidden + overflowY:visible
### May 19, 2026
1695 10:08a ⚖️ V2 Game Interface — Comprehensive Refactor Scope Defined
1696 10:09a 🔵 Miles Bornes Multiplayer Architecture — Host/Client State Machine Traced
1697 " 🔴 server.js — Late-Join State Replay Added to Fix "Awaiting Synchronization" Deadlock
1698 " 🔴 index.html — Host Table Mode Suppresses Private Hand Display on Main Screen
1699 " 🔴 index.html V2 Layout — CSS Grid Collision Fix for Bag, Hand, Actions, and Draw Pile
1700 " 🟣 Miles Bornes v8.2.1 — Full Patch Build Successful
1701 8:01p 🟣 Configurable Race Target Distance in Miles Bornes Game
1702 8:02p 🟣 Event Card Gain Helpers Now Use Dynamic `targetKm` Cap
1703 " 🔵 Remaining Hardcoded 1000 References Catalogued After Partial Refactor
1704 8:04p 🟣 All Inline Event Card Apply Lambdas Updated to Use `targetKm`
1705 " 🟣 All Remaining Hardcoded 1000 References Eliminated from Core Game Logic
1706 " 🟣 Event Frequency Now Configurable Per Difficulty via `eventEveryTurns` and `eventChance`
1707 " 🟣 Race Target Distance Selector Added to Menu UI with localStorage Persistence
1708 8:16p 🟣 Miles_Borne v8.8.1 — Vehicle Expansion Packs and Deep Theme Cards
1709 " 🔴 Remote PC progress bar hardcoded division by 10 fixed
1710 " 🔵 Miles_Borne v8.8.1 architecture snapshot — single-file Electron game

Access 1881k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>