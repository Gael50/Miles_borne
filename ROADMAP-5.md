# ROADMAP-5 — Plan d'action et gameplay profond

> Roadmap priorisée extraite de `workspace/app/frontend/Docs/PROJECT-TRACKING.md` sections 12 + 14-bis + 15.

## Sprint 1 — livré (2026-04-23 / 2026-04-24)

- [x] Fix bloquant Tour 1 (chaîne ACTION→RESOLUTION→END)
- [x] 15 règles éditables + RulesModal
- [x] Server + Electron scaffolds
- [x] Slots Humain/IA/Vide par faction
- [x] Fix écran noir .exe (batch + vite base + HashRouter)
- [x] Territory Editor avec tri-mode + auto/manuel
- [x] GameOverModal cinématique
- [x] Saisons + timeline stratégique
- [x] Hotseat enfin actif
- [x] HUD layout persisté localStorage
- [x] Config de carte par thème (`territories_config.json`)
- [x] Résolution automatique `mapImage` par thème
- [x] Menu.bat entrée 8 éditeur de territoires
- [x] Menu Electron supprimé + maximize au démarrage

## Sprint 2 — court terme (1 semaine)

- [ ] **B1** Client Socket.IO (NetworkManager front)
- [ ] **B2** Assets audio minimaux (5-8 clips .mp3 dans `public/audio/`)
- [ ] **B3** Auto-start tutoriel premier lancement
- [ ] **B5** Icône `.ico` desktop (voir `electron/resources/ICON-SPEC.md`)
- [ ] **M1** Lignes de ravitaillement (BFS capitale)
- [ ] **M3** Taxation 3 niveaux
- [ ] **A1** Flash phase-change plein écran (bref 200ms)

## Sprint 3 — moyen terme (2 semaines)

- [ ] **B4** UI Mouvement de soldats (modal from/to/count)
- [ ] **M2** Loyauté territoriale + rébellions
- [ ] **M8** IA utilise MovementSystem
- [ ] **M9** Tests E2E Playwright (démarrage + 5 tours)
- [ ] **X1** Règles présets (Spec officielle / Chaos / Rapide)

## Sprint 4 — long terme (3-4 semaines)

- [ ] **M4** Météo régionale (sur territoires)
- [ ] **M5** Espionnage + contre-espionnage
- [ ] **M6** Doctrines (5 branches × 3 niveaux)
- [ ] **M7** Éditeur de pouvoirs de faction
- [ ] **F2** Fog of war configurable
- [ ] **F11** Mode Royaume éternel

## Gameplay profond — backlog

### Priorité haute

| Système | Effort | Plan |
|---|---|---|
| Lignes de ravitaillement | M | BFS capitale, flag `supplied`, malus prod/combat, halo rouge |
| Loyauté territoriale | S | `Territory.loyalty: 0..100`, décr après conquête, incr avec temps + garnison |
| Rébellions | S | `loyalty < 20` → retirer ownerId + spawn soldats rebelles |
| Taxation 3 niveaux | S | `Player.taxLevel`, multiplier argent + malus loyauté |
| Moral militaire | S | `Territory.morale: 0..100`, modif combat |

### Priorité moyenne

| Système | Effort | Plan |
|---|---|---|
| Météo régionale | M | `state.weather`, tick round, modif Economy/Combat par région |
| Espionnage + contre-espionnage | M | `SpySystem`, `action:spy` / `action:counter` |
| Routes commerciales | M | `state.tradeRoutes`, bonus argent si reliées |
| Ressources rares régionales | M | Fer/sel/chevaux/pierre/prestige/eau profonde |
| Fatigue de guerre | S | `Player.warFatigue`, incr batailles, malus moral |
| Ordres permanents | S | `Player.standingOrders` consultés par IA |

### Long terme

| Système | Effort | Plan |
|---|---|---|
| Doctrines / Technologies | L | 5 branches × 3 niveaux, coût argent, bonus cumulatifs |
| Crises majeures | M | Extension `EventSystem` tier MAJOR + cooldown |
| Différenciation IA | M | Branches par difficulté (EASY errors, NIGHTMARE exploit) |
| Brouillard partiel | S | Ressources opposées masquées selon relation |
| Pouvoirs évolutifs | M | `FactionPower.level`, choix tous les 5 rounds |
| Événements faction | S | Pool `EventSystem` par `factionId` |

## Ordre d'exécution recommandé

1. **Ravitaillement** + **Loyauté** (prévisibles, lisibles, fort impact)
2. **Rébellions** (conséquences concrètes)
3. **Taxation** (levier direct joueur)
4. **Moral** (retombée combat)
5. **Météo régionale** (amplifie saisons)
6. **Fatigue de guerre**
7. **Doctrines** (progression verticale)
8. **Espionnage / contre-espionnage**
9. **IA différenciée**
10. **Ressources rares + routes commerciales**
11. **Crises majeures + événements faction**
12. **Pouvoirs évolutifs**

## Top 10 actions immédiates

1. Commit de l'état courant (saisons + timeline + HUD persist + fix .exe + config par thème).
2. Tester le `.exe` portable actualisé.
3. Tester Hotseat depuis Home.
4. Ajouter 5-8 assets audio.
5. Référencer audio dans `data/themes.ts`.
6. Auto-tutoriel : `localStorage.conquistador_first_launch`.
7. `src/core/NetworkManager.ts` Socket.IO client.
8. E2E Playwright.
9. UI Mouvement de soldats.
10. Ravitaillement + Loyauté (Sprint 2).

---

*Roadmap à synchroniser avec `workspace/app/frontend/Docs/PROJECT-TRACKING.md` après chaque sprint.*
