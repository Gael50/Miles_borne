# Legacy adapters

Ce dossier sert uniquement pendant la migration.

Un adaptateur legacy doit :

- exposer une interface courte et nommee ;
- pointer vers une entree du `docs/architecture/EXTRACTION_LEDGER.md` ;
- etre supprime des qu'un module `src/` devient la source de verite ;
- ne pas contenir de nouvelle logique metier.

