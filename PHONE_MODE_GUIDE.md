# Mode téléphone / second écran

## Architecture retenue

Le build Electron peut lancer deux serveurs locaux depuis `server.js` :

- un serveur TCP autoritaire pour les clients PC (`port`, par défaut `7891`) ;
- un serveur HTTP compagnon pour les téléphones (`port + 1`, par défaut `7892`).

Le téléphone rejoint `http://IP:PORT+1/mobile`, choisit un joueur libre et reçoit un jeton local. Le serveur conserve l'association `device -> playerId`, l'expose au lobby hôte, puis reçoit depuis le jeu hôte une vue privée sanitizée de la main du joueur associé.

La partie React reste le moteur de règles : le téléphone envoie des intentions (`play-card`, `discard-card`) au serveur HTTP, puis le jeu hôte draine cette file et valide l'action avec les mêmes fonctions que le desktop (`processPlay`, `processDiscard`, `canPlay`).

## Flux d'utilisation

1. Depuis le menu, ouvrir `Multijoueur > Héberger`.
2. Activer `Mode téléphone / second écran`.
3. Démarrer le serveur.
4. Partager l'URL téléphone affichée, par exemple `http://192.168.1.12:7892/mobile`.
5. Le joueur ouvre l'URL sur son téléphone, choisit son nom dans la liste et devient associé à ce joueur.
6. Quand la partie démarre, la main de ce joueur est masquée sur l'écran principal et visible sur son téléphone.
7. Le joueur peut jouer ou défausser depuis le téléphone ; l'hôte valide l'action et synchronise le résultat.

## Séparation des données privées

La base serveur distingue :

- les clients PC classiques ;
- les contrôleurs mobiles (`mobileControllers`) ;
- les joueurs revendiqués par téléphone.

Le serveur ne révèle pas les mains adverses dans l'interface mobile. Chaque téléphone ne peut lire que `/api/player?token=...`, qui retourne uniquement :

- l'identité du joueur revendiqué ;
- son statut public utile ;
- sa main privée ;
- les cibles autorisées ;
- les raisons de non-jouabilité calculées par l'hôte.

Les actions mobiles passent par `/api/action` et sont stockées dans une file (`drainMobileActions()`). Le moteur hôte refuse les actions si ce n'est pas le tour du joueur, si la carte n'existe plus, ou si la cible est invalide.

## Points de vigilance

- Le téléphone doit être sur le même réseau local ou rejoindre via Hamachi/VPN compatible HTTP.
- La version actuelle synchronise les mains des joueurs humains gérés par le serveur hôte local. Les clients PC distants restent représentés dans la room, mais l'affichage complet de leur partie locale nécessite une couche client PC dédiée.
- Un joueur déjà revendiqué ne peut pas être pris par un second téléphone.
- En cas de problème de pare-feu Windows, autoriser l'exécutable sur les ports TCP/HTTP configurés.
- Le téléphone n'est pas un client de règles autonome : il commande, l'hôte décide. C'est volontaire pour éviter les divergences d'état.
