# `src/` — cible de modularisation

Ce dossier est la destination progressive du code actuellement concentre dans `index.html`.

Regle : aucun nouveau systeme durable ne doit etre ajoute directement dans le monolithe si un dossier `src/` existe deja pour cette responsabilite.

Ordre conseille :

1. extraire les helpers purs ;
2. extraire les donnees ;
3. extraire les effets de cartes/evenements ;
4. extraire les composants UI stables ;
5. brancher les pages/runtime.

