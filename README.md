# Miles_Borne

Jeu Mille Bornes Electron/React actuellement en migration progressive depuis un `index.html` monolithique vers une architecture modulaire.

## Commandes utiles

```powershell
npm run arch:check
npm run test:e2e
npm run build
```

## Sources importantes

- Runtime legacy actuel : `index.html`
- Serveur local : `server.js`
- Client reseau : `netclient.js`
- Detection IP : `netinfo.js`
- Tests : `tests/`
- Architecture cible : `docs/architecture/ARCHITECTURE.md`
- Plan de migration : `docs/architecture/MIGRATION_PLAN.md`
- Regles d'import : `docs/architecture/MODULE_BOUNDARIES.md`
- Rollback : `docs/architecture/ROLLBACK.md`

## Regle de migration

Le jeu doit rester jouable a chaque etape. On extrait d'abord les helpers purs et les donnees, puis seulement les composants UI et les flux reseau sensibles.
