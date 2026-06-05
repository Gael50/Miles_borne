Original prompt: Audit complet QA/frontend/gameplay avec installation Playwright, reproduction/correction des cartes "Undéfini", effets/événements non appliqués, hover V2, descriptions d'événements, largeur Réglages, popup "Joueur à toi de jouer" et interfaces détectées repliables.

## Notes de session

- Démarrage : sauvegardes créées avant modifications (`index.pre-v882-qa-playwright.html`, `package.pre-v882-qa-playwright.json`, `package-lock.pre-v882-qa-playwright.json`).
- `CHANGELOG-2.md` absent du dépôt malgré la consigne AGENTS ; audit poursuivi sur les fichiers réels du projet.
- Playwright installé (`@playwright/test` + Chromium) et configuration `playwright.config.js` ajoutée.
- Correctifs appliqués : normalisation des cartes dynamiques/shop, effet réel de pioche événementielle, Feu Rouge bloquant vraiment, timer de tour stabilisé, V2 hover borné, Réglages élargis, interfaces réseau repliées par défaut.

## Correctif V2 hover auto-entretenu

- Cause racine confirmée : la preview de carte créée par `hoveredCard` était rendue avant le panneau de main. Les styles V2 ciblaient encore le panneau par `.layout-center > div:nth-child(2)`, donc au hover la preview devenait le deuxième enfant, héritait des contraintes de panneau, et la main perdait son ancrage bas. Ce reflow faisait sortir/rentrer la souris de la carte en boucle.
- Correction : le panneau de main possède maintenant la classe stable `.v2-hand-panel`, la preview est rendue après ce panneau, et la couche CSS finale cible la classe stable plutôt que l’index DOM fragile. La preview réinitialise aussi explicitement `right`, `bottom`, `height`, `display`, `transform` et `pointer-events` pour ne plus pouvoir se transformer en panneau de main.
- Test ajouté : non-régression Playwright source/CSS vérifiant l’ordre panneau/preview et l’absence du sélecteur fragile dans la couche finale.

## Amorce architecture modulaire

- Arborescence `src/` creee avec couches `core`, `entities`, `features`, `shared`, `widgets`, `pages`, `themes`, `assets`.
- Documentation ajoutee dans `docs/architecture/` : architecture cible, boundaries, migration progressive, rollback.
- Garde-fou ajoute : `npm run arch:check` via `scripts/architecture/check-module-boundaries.cjs`.
- Tests architecture ajoutes dans `tests/architecture.spec.js`.
- Version projet synchronisee en `8.11.1`.

## Migration modulaire — lot core faible risque

- Documents de pilotage ajoutes : `EXTRACTION_ROADMAP.md`, `EXTRACTION_LEDGER.md`, `VALIDATION_MATRIX.md`.
- EXT-001 validee : longueur de partie et milestones dans `src/core/game/progression/target-distance.js`.
- EXT-002 validee : difficultes et multiplicateurs dans `src/core/game/difficulty/difficulty.data.js`.
- EXT-003 validee : score final dans `src/core/game/scoring/calc-score.js`.
- Tests ajoutes : `tests/core-game.spec.js`.
- Validation : `npm run arch:check` OK, tests cibles OK, `npm run test:e2e` OK (15 tests).
- Version projet synchronisee en `8.12.1`.
- EXT-004 validee : geometrie route V2 dans `src/features/progress-road/v2-road-geometry.js`.
- EXT-005 validee : slots joueurs V2 dans `src/features/player-layout-v2/player-slots.js`.
- EXT-006 validee : fallback texte carte dans `src/entities/cards/descriptions/humanize-card-value.js`.
- Validation complementaire : tests V2 geometry/card copy OK (7 tests), `npm run test:e2e` OK (19 tests), `npm run build` OK (`dist/Miles_Borne 8.12.1.exe`).

## Migration modulaire — lot cartes/vehicules pur

- Git initialise : branche stable `main`, tag `baseline-migration-8.12.1`, branche courte `refactor/extract-card-normalization`.
- EXT-007 validee : normalisation cartes dans `src/entities/cards/card-normalizer.js`.
- EXT-008 validee : textes et descriptions cartes dans `src/entities/cards/descriptions/card-copy.js`.
- EXT-010 validee : filtrage vehicules par theme dans `src/entities/vehicles/vehicle-filter.js`.
- Compatibilite : runtime `index.html` non branche, fonctions legacy conservees jusqu'a bascule controlee.
- Validation : `npm run arch:check` OK, tests cibles card/vehicles/architecture OK (9 tests), `npm run test:e2e` OK (25 tests), `npm run build` OK (`dist/Miles_Borne 8.13.1.exe`).
- Version projet synchronisee en `8.13.1`.

## Migration modulaire — lot donnees/factories

- Branche courte : `refactor/extract-data-factories`.
- EXT-011 validee : catalogue `VEHICLES` + `VEHICLE_EXPANSION_PACKS` dans `src/entities/vehicles/data/vehicles.data.js`.
- EXT-012 validee : factory joueur compatible `newP` dans `src/entities/players/player-factory.js`.
- EXT-013 validee : deck builder theme-aware dans `src/entities/cards/data/build-deck.js`, avec injection de `buildThemeDeepCards` pour ne pas coupler le module au legacy.
- Compatibilite : runtime `index.html` non branche, blocs legacy conserves jusqu'a bascule controlee.
- Validation : `npm run arch:check` OK, tests cibles vehicles/player/deck/architecture OK (12 tests), `npm run test:e2e` OK (34 tests), `npm run build` OK (`dist/Miles_Borne 8.14.1.exe`).
- Version projet synchronisee en `8.14.1`.
- Prochain lot recommande : EXT-009 en extraction pure + tests ciblage/immunites ; branchement runtime a differer tant que `applySelf` / `applyAtk` ne sont pas couverts.

## Migration modulaire — lot ciblage cartes

- Branche courte : `refactor/extract-card-targeting`.
- EXT-009 validee en extraction pure : immunites, restrictions de cibles, cibles protegees, cibles deja affectees et cartes partiellement jouables dans `src/entities/cards/targeting/card-targeting.js`.
- Tests ajoutes : `tests/card-targeting.spec.js`, couvrant cartes jouables/injouables, cibles immunisees/protegees/grisees, fallback sans cible valide, coherence avec normalisation et copy cartes.
- Compatibilite : runtime `index.html` non branche, fonctions legacy `isImmune`, `getPlayability`, `targetStatusForCard` et `targetsForPlayer` conservees jusqu'au lot adaptateur.
- Validation : `npm run arch:check` OK, tests cibles EXT-009 OK (16 tests), `npm run test:e2e` OK (44 tests), `npm run build` OK (`dist/Miles_Borne 8.15.1.exe`).
- Decision : module pret pour extraction + adaptateur legacy ; branchement runtime complet differe apres isolation de `draw/deal/refill`, `applySelf` et `applyAtk`.
- Version projet synchronisee en `8.15.1`.

## Migration modulaire — lot deck/discard

- Branche courte : `refactor/extract-deck-actions`.
- EXT-014 validee en extraction pure : `drawCard`, `dealAll`, `refillHand` et helpers associes dans `src/features/deck-discard/deck-actions.js`.
- Helpers ajoutes pour la transition runtime : `refillHandMutable`, `drawCardsIntoHand`, `discardCardFromHand`, `countCardsInZones`.
- Compatibilite : runtime `index.html` non branche, fonctions legacy `drawCard`, `dealAll` et `refillHand` conservees jusqu'au lot adaptateur.
- Validation : `npm run arch:check` OK, tests cibles EXT-014 OK (17 tests), `npm run test:e2e` OK (55 tests), `npm run build` OK (`dist/Miles_Borne 8.16.1.exe`).
- Gestion Git hors lot : `AGENTS.md` reste exclu volontairement des commits de migration pour ne pas melanger la memoire operationnelle avec les extractions code.
- Version projet synchronisee en `8.16.1`.

## Migration modulaire — lot effets self

- Branche courte : `refactor/extract-apply-self`.
- EXT-015 validee en extraction pure : `applySelf`, helpers `applyBoost`, `applyBotte`, `applyDistance`, `applyRemedy`, `refillFuel`, `cloneSelfPlayer` dans `src/entities/cards/effects/apply-self.js`.
- Tests ajoutes : `tests/apply-self.spec.js`, couvrant bottes, coups fourres, distances, limites, restrictions vehicule, target km, feu vert, remedes, premium, bricolage, fin limite, draw/reroll/shield/double-play et invariants de clonage.
- Compatibilite : runtime `index.html` non branche, fonction legacy `applySelf` conservee jusqu'au lot adaptateur.
- Validation : `npm run arch:check` OK, tests cibles EXT-015 OK (41 tests), `npm run test:e2e` OK (72 tests), `npm run build` OK (`dist/Miles_Borne 8.17.1.exe`).
- Gestion Git hors lot : `AGENTS.md` reste exclu volontairement des commits de migration.
- Version projet synchronisee en `8.17.1`.

## Migration modulaire — lot effets attaque

- Branche courte : `refactor/extract-apply-attack`.
- EXT-016 validee en extraction pure : `applyAtk`, helpers `applyHack`, `applySabotage`, `applyTrap`, `applySlow`, `applyLimit`, `applyBlock`, `applyHazard`, `applyShieldParry`, `attackImmunityValue`, `cloneAttackTarget` dans `src/entities/cards/effects/apply-attack.js`.
- Tests ajoutes : `tests/apply-attack.spec.js`, couvrant attaque standard, immunites, bouclier, sabotage, piratage, zone single-target, pieges, ralentissement, cible deja affectee, coherence ciblage et invariants de clonage.
- Compatibilite : runtime `index.html` non branche, fonction legacy `applyAtk` conservee jusqu'au lot adaptateur.
- Validation : `npm run arch:check` OK, tests cibles EXT-016 OK (42 tests), `npm run test:e2e` OK (84 tests), `npm run build` OK (`dist/Miles_Borne 8.18.1.exe`).
- Gestion Git hors lot : `AGENTS.md` reste exclu volontairement des commits de migration.
- Version projet synchronisee en `8.18.1`.

## Migration modulaire — lot effets action

- Branche courte : `refactor/extract-apply-action`.
- EXT-017 validee en extraction pure : `applyAction`, `applySteal`, `clampChoiceIndex`, `randomChoiceIndex`, `isRuntimeOrchestratedAction`, `cloneActionTarget` dans `src/entities/cards/effects/apply-action.js`.
- Tests ajoutes : `tests/apply-action.spec.js`, couvrant vol choisi, vol aleatoire injectable, main vide, bouclier, action invalide, chaos couple runtime, coherence ciblage et invariants de clonage.
- Compatibilite : runtime `index.html` non branche, fonction legacy `applyAction` conservee jusqu'au lot adaptateur.
- Comportement encore couple a `processPlay` : `chaos` / evenement aleatoire global, car il depend de logs, discard/refill, triggerRandomEvent et transitions de tour.
- Validation : `npm run arch:check` OK, tests cibles EXT-017 OK (36 tests), `npm run test:e2e` OK (95 tests), `npm run build` OK (`dist/Miles_Borne 8.19.1.exe`).
- Gestion Git hors lot : `AGENTS.md` reste exclu volontairement des commits de migration.
- Version projet synchronisee en `8.19.1`.

## Migration modulaire — lot processPlay adapter prep

- Branche courte : `refactor/process-play-adapter-prep`.
- EXT-018 validee sans branchement runtime : `processPlay` cartographie dans `docs/architecture/PROCESS_PLAY_MAP.md` et seam testable dans `src/features/game-runtime/process-play-adapter.js`.
- Tests ajoutes : `tests/process-play-adapter.spec.js`, couvrant classification self/attack/action/zone/chaos, responsabilites runtime vs modules extraits, et ordre de bascule.
- Compatibilite : runtime `index.html` non branche, `processPlay` legacy conserve.
- Zone encore couplee : `zone` multi-cibles et `chaos` restent runtime-only jusqu'a extraction event/zone runner.
- Recommandation suivante : EXT-019 `played-card-consumption`, seam commun main/inventaire + discard/refill avant tout branchement d'effet.
- Validation : `npm run arch:check` OK, tests cibles EXT-018 OK (49 tests), `npm run test:e2e` OK (101 tests), `npm run build` OK (`dist/Miles_Borne 8.20.1.exe`).
- Gestion Git hors lot : `AGENTS.md` reste exclu volontairement des commits de migration.
- Version projet synchronisee en `8.20.1`.

## Migration modulaire — lot played-card consumption

- Branche courte : `refactor/played-card-consumption`.
- EXT-019 validee sans branchement runtime : consommation main/inventaire, etats pending/interrupted, anti double-discard, discard/refill, reroll, drawBonus et vol dans `src/features/game-runtime/played-card-consumption.js`.
- Tests ajoutes : `tests/played-card-consumption.spec.js`, couvrant consommation normale, inventaire, conservation du total, interruption, pending, coherence `applySelf`, `applyAttack`, `applyAction` et injection de refill.
- Compatibilite : runtime `index.html` non branche, logique legacy de consommation dans `processPlay` conservee jusqu'au lot adaptateur.
- Validation : `npm run arch:check` OK, tests cibles EXT-019 OK (72 tests), `npm run test:e2e` OK (113 tests), `npm run build` OK (`dist/Miles_Borne 8.21.1.exe`).
- Recommandation suivante : EXT-020 branche self limitee, en utilisant `applySelf` + `consumePlayedCard` sans toucher a zone/chaos/vol/attack.
- Gestion Git hors lot : `AGENTS.md` reste exclu volontairement des commits de migration.
- Version projet synchronisee en `8.21.1`.

## Migration modulaire — lot processPlay self adapter

- Branche courte : `refactor/process-play-self-adapter`.
- EXT-020 validee avec branchement runtime limite : la branche self de `processPlay` passe par `RuntimeSelfLayer` quand `src/features/game-runtime/process-play-self-adapter.js` est disponible.
- Adaptateur ajoute : `resolveSelfCardPlay`, compose `applySelf` + `consumePlayedCard` et conserve un fallback legacy explicite en cas d'indisponibilite ou de consommation non confirmee.
- Tests ajoutes/adaptes : `tests/process-play-self-adapter.spec.js`, couvrant distance, remede, premium, bricolage, botte/coup fourre, inventaire, draw/reroll, fallback et verification source du branchement self uniquement.
- Compatibilite : action, attack, zone et chaos restent dans le flux legacy de `processPlay`.
- Validation : `npm run arch:check` OK, tests cibles EXT-020 OK (47 tests), `npm run test:e2e` OK (122 tests), `npm run build` OK (`dist/Miles_Borne 8.22.1.exe`).
- Gestion Git hors lot : `AGENTS.md` reste exclu volontairement des commits de migration.
- Version projet synchronisee en `8.22.1`.
