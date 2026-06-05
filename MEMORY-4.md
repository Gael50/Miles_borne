# MEMORY-4 — État actuel et mémoire vive du projet

> Fichier de mémoire opérationnelle. Contient l'état courant des systèmes, le dictionnaire des concepts et les systèmes fonctionnels. Mis à jour à chaque session.
> Source maître : `workspace/app/frontend/Docs/PROJECT-TRACKING.md`.

## 1. Identité

- **Nom produit UI** : Conquistador (affiché)
- **Nom interne historique** : Conquête
- **Version** : Beta v0.9.7
- **Stack réelle** : React 18 + TypeScript + Vite 5 + Zustand + shadcn/ui + Tailwind 3. Backend : Express + Socket.IO (scaffold). Desktop : Electron 31 + electron-builder.

## 2. État actuel des systèmes

### Gameplay — fonctionnel
- Boucle de tour complète 6 phases (Prép / Prod / Conso / Action / Rés / Fin), fix ACTION→RESOLUTION→END chainé.
- 5 factions (Lames d'Acier, Pillards du Crépuscule, Guilde Dorée, Caméléons, Ordre du Silence).
- Pouvoirs passifs (Rouge/Orange/Jaune) et actifs (Vert copie, Violet sabotage) câblés.
- IA 4 difficultés (EASY / NORMAL / AGGRESSIVE / NIGHTMARE) avec activation auto des pouvoirs.
- Modes SOLO + HOTSEAT opérationnels. LAN/ONLINE redirigent vers lobby scaffold.
- 3 conditions de victoire (élimination, domination totale, domination majoritaire ≥3 rounds).
- Saisons dynamiques 4×3 rounds avec modificateurs Economy/Combat/Growth/Events.
- Autosave en fin de round complet (solo/hotseat, toggleable via règles).

### Gameplay — scaffold / partiel
- Serveur multijoueur `server.cjs` (REST lobby + Socket.IO lazy).
- Client NetworkManager front → non câblé (backlog).
- MovementSystem présent mais pas d'UI humain ni usage IA.
- Audio listeners prêts, silencieux (pas d'assets .mp3 référencés).
- Tutoriel UI complet, `startTutorial` jamais appelé auto.

### UI — fonctionnel
- Home theme-aware, typo `clamp(3.5rem,10vw,8.5rem)`, 3 ModeCards inline, Factions showcase.
- TopBar : 6 phases mini-timeline, 4 ressources tooltips, bouton Pouvoir LED+cooldown, mute audio, toggle fond carte.
- GameMap : 2D plat, `<img>` avec fallback erreur, rendu `<path>` ou `<polygon>`, skip `visible===false`.
- DiplomacySidePanel : 5 slots, nom complet, mini-stats, leader badge, pulse tour actuel.
- StrategicTimeline basse : saison + ordre factions + signaux (trêves, pouvoirs, famine, collapse).
- TerritoryPanel flottant : prévision locale, bâtiments, actions contextuelles.
- WarJournal : récents en haut, scrollbar mince, icônes par catégorie.
- FxToasts : 8 kinds avec accent bar glow.
- GameOverModal cinématique : vignette couleur faction, 9 StatCards, banner cérémonie.
- HUDEditor : inputs num, grille, snap, preview, undo, reset, persist localStorage.
- TerritoryEditor : tri-mode (Consult/Édition/Verrou) × auto/manuel (zoom+offset), import/export Nathan JSON, chargement config thème.
- RulesModal : 15 règles toggleables, 6 catégories, persist localStorage.

## 3. Systèmes Zustand

| Store | Rôle |
|---|---|
| `gameStore` | gameState, selectedTerritory, modals, notifications |
| `tutorialStore` | étapes tutoriel (non démarré auto) |
| `fxStore` | FX éphémères (flash polygone + toasts 8 types) |
| `audioStore` | mute + volume persisté |
| `rulesStore` | 15 règles gameplay persistées |

## 4. Systèmes de jeu

| Système | Rôle |
|---|---|
| `EconomySystem` | Production + consommation + pénuries + saisons |
| `CombatSystem` | 5 issues, pillage, bonus factions, saisons |
| `DiplomacySystem` | Alliances / paix / échange / trahison |
| `BuildingSystem` | Construction avec validation |
| `MovementSystem` | Mouvement soldats (no UI) |
| `RecruitmentSystem` | Recrutement + fermiers |
| `VictorySystem` | 3 conditions + autosave + counters dédupliqués |
| `AISystem` | Heuristique par difficulté + pouvoirs actifs |
| `EventSystem` | 4 événements aléatoires (règles) |
| `FactionPowerSystem` | Copy_power + Sabotage |
| `SeasonSystem` | Cycle 4 saisons × 3 rounds |
| `AudioSystem` | Hooks audio throttled (silencieux par défaut) |

## 5. Dictionnaire

| Terme | Sens |
|---|---|
| Phase | START / PRODUCTION / CONSUMPTION / ACTION / RESOLUTION / END |
| Round | Tour complet (wrap player 0) |
| Saison | Cycle 3 rounds : Printemps / Été / Automne / Hiver |
| Slot | Config Humain/IA/Vide par faction |
| Zone | Région HUD `{x,y,width,height,zIndex,invisible?}` |
| FX | Effet visuel éphémère (flash territoire + toast) |
| Règle (Rule) | Paramètre gameplay éditable |
| Pouvoir actif | Déclenchable (Cameleons / Ordre du Silence) |
| Pouvoir passif | Toujours actif (Lames / Pillards / Guilde) |
| Copy_power | Cameleons : duplique pouvoir autre faction 1 tour |
| Sabotage | Ordre du Silence : -30% production 2 tours |
| Domination majoritaire | ≥60% territoires × 3 rounds (configurable) |
| Collapse | 5 rounds consécutifs sans capacité militaire → élim |
| Trahison | Attaque sur allié → rupture + malus |
| Thème | Pack visuel : HUD image + map texture + audio |
| Layout | Mapping zones HUD pour un thème (localStorage ou JSON) |
| Signal stratégique | Alerte timeline basse (trêves, pouvoirs, famine) |

## 6. Pointeurs

- Détail exhaustif : `workspace/app/frontend/Docs/PROJECT-TRACKING.md`
- Code source : `workspace/app/frontend/src/`
- Config thèmes : `workspace/app/frontend/public/themes/<theme>/`
