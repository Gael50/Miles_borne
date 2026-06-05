# 🌐 Multijoueur local + Hamachi — Guide rapide

## Architecture
Le multi local est implémenté en **Electron + Node TCP natif** (aucune dépendance npm supplémentaire) :

| Fichier | Rôle |
|---|---|
| `server.js` | Serveur TCP autoritatif (port par défaut **7891**), protocol JSON line-delimited |
| `netclient.js` | Client TCP léger avec timeout 5 s, reconnect manuel |
| `netinfo.js` | Détection des interfaces réseau (priorité : Hamachi → LAN → autres) |
| `main.js` | Electron avec `nodeIntegration:true, contextIsolation:false` pour autoriser `require` direct |
| `index.html` (composants `LobbyHost` / `LobbyJoin`) | UI React pour héberger / rejoindre |

## Détection IP automatique
- L'adaptateur **Hamachi** est identifié par :
  - nom d'interface contenant "Hamachi" ou "LogMeIn", OU
  - IP commençant par `25.` ou `7.` (plages historiques)
- IPs **LAN privées** : `192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`
- Tri : Hamachi en tête, puis LAN, puis autres. Une IP est marquée **★ recommandée**.

## Démarrer / Rejoindre

### Hôte
1. Menu principal → **🌐 Héberger**
2. Choisir nom + port (7891 par défaut) + nombre de joueurs locaux sur la machine hôte
3. Cliquer **▶ Démarrer l'hébergement**
4. Copier l'IP affichée (Hamachi si présent, sinon LAN) au format `25.x.x.x:7891`
5. Partager avec les amis
6. Attendre que les clients se connectent (visible en temps réel dans la liste)
7. Cliquer **▶ DÉMARRER LA PARTIE** quand prêt (min. 2 joueurs au total)

### Client
1. Menu principal → **🔗 Rejoindre**
2. Saisir nom + IP hôte (Hamachi ou LAN) + port + nombre de joueurs locaux
3. Cliquer **🔗 SE CONNECTER**

## Mode hybride par machine
Chaque machine déclare combien de joueurs humains jouent dessus (1-7). Le serveur centralise et alloue les slots :
- PC hôte : 2 joueurs
- PC client A : 2 joueurs
- PC client B : 1 joueur
- ⟹ partie à **5 joueurs au total**

## Protocol réseau (résumé)

### Client → Serveur
- `{type:"hello", name, localPlayers, version}`
- `{type:"action", action, payload}`
- `{type:"ping"}`

### Serveur → Clients
- `{type:"welcome", clientId, hostName, protocolVersion}`
- `{type:"roster", clients:[{id,name,localPlayers,addr}], slotsAllocated}`
- `{type:"state", state}`
- `{type:"start"}`
- `{type:"pong", t}`
- `{type:"error", message}`

## Sécurité / fiabilité
- Validation buffer client : déconnexion auto si > 1 MB
- Timeout de connexion client : 5 s
- Nettoyage automatique des clients fermés (close/error event)
- Validation `localPlayers` clampée [1, 7]
- Détection multi-newline pour traiter plusieurs messages dans un même paquet TCP

## Configuration Hamachi
1. Installer LogMeIn Hamachi (gratuit)
2. Créer ou rejoindre un réseau Hamachi avec ses amis
3. L'IP Hamachi (`25.x.x.x`) apparaît automatiquement comme **★ recommandée** dans le panneau Héberger
4. Les amis se connectent à cette IP Hamachi depuis n'importe où dans le monde
