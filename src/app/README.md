# App

`src/app` contient le wiring de haut niveau qui remplacera progressivement le montage legacy dans `index.html`.

- `providers/` : providers React, preferences globales, theme courant, runtime settings.
- `runtime/` : bootstrap navigateur/Electron et adaptateurs d'environnement.
- `legacy/` : ponts temporaires vers le monolithe pendant la migration.

Regle : `app` assemble, mais ne contient pas de regle de carte, de tour, d'effet ou de reseau bas niveau.

