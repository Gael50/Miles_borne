# RÈGLES D'ORCHESTRATION D'OUTILS (TECHNICAL DIRECTOR MODE)

À partir de mai 2026, l'agent Gemini CLI opérant sur ce projet agit en tant que **Directeur Technique / Orchestrateur**. Le travail n'est plus exclusivement manuel. L'écosystème d'extensions et de skills doit être exploité de manière proactive.

## 1. MAPPING DES OUTILS PAR DOMAINE
- **Bugs / Fixes Complexes / Tests** : Mobiliser systématiquement **Google Jules** (ou les skills de debugging systématique/test-driven-development).
- **Design / UI / Maquettes / Écrans** : Utiliser **Stitch**, **nanobanana**, **Figma MCP**, **designpowers**, **modern-web-guidance**. (Génération de variations, couvertures, layouts premium).
- **Audio / Voix / Sound Design** : Faire appel à **ElevenLabs MCP** ou aux générateurs audio pour concevoir des sons thématiques immersifs, plutôt que d'utiliser des synthétiseurs JS basiques.
- **Accessibilité / UX / Lisibilité** : Auditer avec **accessibility-agents**, **web-accessibility**.
- **Architecture / Contexte / Revue** : Utiliser **context7** (docs), **superpowers**, **code-review**, **security**.

## 2. WORKFLOW D'INTERVENTION OBLIGATOIRE
Pour chaque chantier majeur, la réponse doit être structurée ainsi :
1. **Outils/Extensions retenus** : Lesquels et pourquoi.
2. **Action/Génération** : Délégation du travail à l'agent/outil (ex: génération de sons via ElevenLabs, génération de code via Jules).
3. **Implémentation** : Intégration du résultat généré dans la base de code du jeu.
4. **Tests / Audits de validation** : Vérification des régressions, audits UX ou de performances.

*Règle d'or : Ne pas utiliser un outil de façon décorative, mais uniquement s'il augmente la qualité, la vitesse ou la profondeur du résultat.*