// ─── server.js — Serveur TCP de partie locale (hôte) ──────────────────────
// Aucune dépendance externe : utilise le module `net` natif Node.
// Architecture host/clients :
//   - 1 machine = serveur autoritatif (state-of-truth)
//   - N machines clients connectées en TCP
//   - Protocol JSON line-delimited (un message = un objet JSON suivi de '\n')
//
// Messages côté client → serveur :
//   { type:'hello', name, localPlayers, version }
//   { type:'action', action, payload }
//   { type:'ping' }
//
// Messages côté serveur → clients :
//   { type:'welcome', clientId, roomId, slots, hostName }
//   { type:'roster', clients:[{id, name, localPlayers, addr}], slotsAllocated }
//   { type:'state', state }       // état complet de la partie
//   { type:'start' }              // démarrage de la partie
//   { type:'pong' }
//   { type:'error', message }
//
// Utilisation :
//   const { createServer } = require('./server.js');
//   const srv = createServer({
//       port: 7891,
//       onClientJoin: (client) => console.log('client', client.id, 'joined'),
//       onClientLeave: (id) => console.log('client', id, 'left'),
//       onMessage: (clientId, msg) => { ... },
//   });
//   srv.start();
//   srv.broadcast({type:'state', state:...});
//   srv.stop();

const net = require('net');
const http = require('http');
const crypto = require('crypto');

const PROTOCOL_VERSION = 1;
const DEFAULT_PORT = 7891;

function createServer(opts = {}) {
    const port = opts.port || DEFAULT_PORT;
    const onClientJoin = opts.onClientJoin || (() => {});
    const onClientLeave = opts.onClientLeave || (() => {});
    const onMessage = opts.onMessage || (() => {});
    const onError = opts.onError || ((e) => { console.error('[server]', e); });
    const onLog = opts.onLog || (() => {});
    const onStatus = opts.onStatus || (() => {});

    let server = null;
    let mobileServer = null;
    let nextClientId = 1;
    const clients = new Map();    // clientId → { id, socket, name, localPlayers, addr, buffer }
    const mobileControllers = new Map(); // token → { token, playerId, deviceName, connectedAt, lastSeen }
    const mobilePrivateState = new Map(); // playerId → état privé sanitizé envoyé au téléphone associé
    const mobileActions = []; // actions HTTP en attente, drainées par l'hôte Electron
    const mobileActionTokens = new Map(); // actionId -> token téléphone, pour publier le résultat validé par la table
    const mobileActionResults = new Map(); // token -> dernier résultat d'action affichable côté téléphone
    const remoteActions = []; // actions TCP des PC distants, drainées par l'hôte Electron
    const clientPrivateState = new Map(); // clientId -> dernier état privé pour les joueurs de cette machine
    let lastPublicState = null;
    let hostPlayerNames = [];
    let running = false;
    const mobileEnabled = opts.mobileEnabled !== false;
    const mobilePort = opts.mobilePort || (port + 1);

    function send(socket, obj) {
        if (!socket || socket.destroyed) return false;
        try {
            socket.write(JSON.stringify(obj) + '\n');
            return true;
        } catch (e) { onError(e); return false; }
    }

    function broadcast(obj, excludeId = null) {
        if (obj && obj.type === 'state') lastPublicState = obj.state || null;
        for (const c of clients.values()) {
            if (excludeId !== null && c.id === excludeId) continue;
            send(c.socket, obj);
        }
    }

    function disconnectClient(id, reason) {
        const c = clients.get(id);
        if (!c) return;
        try { send(c.socket, { type:'error', message: reason || 'disconnected' }); } catch(e){}
        try { c.socket.end(); } catch(e){}
        try { c.socket.destroy(); } catch(e){}
        clients.delete(id);
        onClientLeave(id);
        onStatus({ running, port, mobilePort: mobileEnabled ? mobilePort : null, clientCount: clients.size });
    }

    function rosterPayload() {
        let slotCursor = 0;
        const hostPlayers = hostPlayerNames.map((name, idx) => ({
            slot: slotCursor++,
            localIndex: idx,
            name: name || `Joueur local ${idx + 1}`,
            ready: true,
            machineId: 'host',
            machineName: opts.hostName || 'Hôte',
            mobileControlled: !!findMobileTokenForPlayer(`host:${idx}`),
        }));
        const clientsList = Array.from(clients.values()).map(c => {
            const names = Array.isArray(c.playerNames) ? c.playerNames : [];
            const localCount = Math.max(1, parseInt(c.localPlayers || 1, 10));
            const players = Array.from({ length: localCount }).map((_, idx) => ({
                slot: slotCursor++,
                localIndex: idx,
                name: names[idx] || `${c.name || `Client ${c.id}`} #${idx + 1}`,
                ready: true,
                machineId: c.id,
                mobileControlled: !!findMobileTokenForPlayer(`${c.id}:${idx}`),
            }));
            return {
                id: c.id,
                name: c.name || `Client ${c.id}`,
                localPlayers: localCount,
                addr: c.addr,
                playerNames: players.map(p => p.name),
                players,
            };
        });
        return {
            type: 'roster',
            hostPlayers,
            clients: clientsList,
            mobileControllers: Array.from(mobileControllers.values()).map(m => ({
                playerId:m.playerId,
                deviceName:m.deviceName,
                connectedAt:m.connectedAt,
                lastSeen:m.lastSeen,
                syncedAt:m.syncedAt || 0,
                syncStatus: mobilePrivateState.has(m.playerId) ? 'synced' : 'waiting-state',
            })),
            slotsAllocated: clientsList.reduce((s, c) => s + (c.localPlayers || 0), 0),
        };
    }

    function findMobileTokenForPlayer(playerId) {
        for (const m of mobileControllers.values()) {
            if (m.playerId === playerId) return m.token;
        }
        return null;
    }

    function allClaimablePlayers() {
        const roster = rosterPayload();
        const host = (roster.hostPlayers || []).map((p, idx) => ({
            id:`host:${idx}`,
            name:p.name,
            machine:'Hôte',
            claimed:!!findMobileTokenForPlayer(`host:${idx}`),
        }));
        const remote = (roster.clients || []).flatMap(c => (c.players || []).map((p, idx) => ({
            id:`${c.id}:${idx}`,
            name:p.name,
            machine:c.name || `Client ${c.id}`,
            claimed:!!findMobileTokenForPlayer(`${c.id}:${idx}`),
        })));
        return host.concat(remote);
    }

    function mobilePageHtml() {
        return `<!doctype html><html lang="fr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Miles Bornes - Téléphone</title>
<style>
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 50% -10%,rgba(37,99,235,.24),transparent 40%),#020617;color:#e2e8f0;font-family:system-ui,Segoe UI,Arial,sans-serif;-webkit-font-smoothing:antialiased}main{min-height:100dvh;padding:calc(12px + env(safe-area-inset-top)) 12px calc(18px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:10px}
.card{background:rgba(15,23,42,.92);border:1px solid rgba(96,165,250,.35);border-radius:18px;padding:14px;box-shadow:0 18px 50px #0008}
h1{font-size:clamp(24px,7vw,34px);margin:0;color:#fff;letter-spacing:.2px}.muted{color:#a7b4c8;font-size:15px;line-height:1.5}.grid{display:grid;gap:10px}
button,input,select{font:inherit;border-radius:14px;border:1px solid rgba(148,163,184,.3);padding:14px;background:#0f172a;color:#e2e8f0;min-height:48px}
button{background:linear-gradient(135deg,#2563eb,#7c3aed);border:0;font-weight:900;cursor:pointer;box-shadow:0 10px 24px rgba(37,99,235,.24)}button:disabled{opacity:.45;filter:grayscale(1);box-shadow:none}.danger{background:linear-gradient(135deg,#ef4444,#991b1b)}
.top{position:sticky;top:0;z-index:20;display:grid;gap:10px;background:linear-gradient(180deg,rgba(2,6,23,.98),rgba(2,6,23,.88));border-bottom:1px solid rgba(96,165,250,.24);padding:10px 0 12px;backdrop-filter:blur(12px)}
.hud{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hud b{display:block;color:#fff;font-size:18px;line-height:1.1}.hud span{display:block;color:#93c5fd;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.7px}.stat{border-radius:16px;background:rgba(30,41,59,.82);border:1px solid rgba(96,165,250,.28);padding:10px}
.banner{border-radius:16px;padding:12px 14px;background:linear-gradient(135deg,rgba(14,165,233,.18),rgba(124,58,237,.18));border:1px solid rgba(125,211,252,.32);font-weight:850;color:#dbeafe}.banner.turn{background:linear-gradient(135deg,rgba(34,197,94,.25),rgba(14,165,233,.18));color:#dcfce7}.banner.warn{background:linear-gradient(135deg,rgba(239,68,68,.22),rgba(251,191,36,.12));border-color:rgba(248,113,113,.38);color:#fee2e2}
.player{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px;border-radius:14px;background:rgba(30,41,59,.9);border:1px solid rgba(148,163,184,.18)}
.pill{font-size:12px;font-weight:900;border-radius:99px;padding:5px 9px;background:rgba(59,130,246,.25);color:#bfdbfe}.pill.good{background:rgba(34,197,94,.2);color:#bbf7d0}.pill.bad{background:rgba(239,68,68,.18);color:#fecaca}
.hand{display:grid;gap:12px}.cardrow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:stretch;padding:14px;border-radius:18px;background:linear-gradient(135deg,rgba(30,41,59,.96),rgba(15,23,42,.94));border:1px solid rgba(148,163,184,.22);box-shadow:0 16px 34px #0006}.cardrow.selected{border-color:#60a5fa;box-shadow:0 0 0 2px rgba(96,165,250,.18),0 18px 46px rgba(59,130,246,.18)}.cardtitle{display:flex;gap:10px;align-items:center;font-size:20px;font-weight:950;color:#fff}.cardicon{font-size:30px;filter:drop-shadow(0 8px 14px #0008)}.desc{font-size:15px;line-height:1.45;color:#cbd5e1;margin-top:5px}.mini{font-size:13px;color:#cbd5e1;margin-top:8px;font-weight:800}.mini.bad{color:#fca5a5}.mini.good{color:#86efac}.actions{display:grid;gap:8px;min-width:112px;align-content:start}.actions button{padding:10px;border-radius:12px;font-size:13px;min-height:42px}
.preview{position:sticky;top:116px;z-index:15}.preview h2{font-size:18px;margin:0 0 6px}.preview .big{font-size:38px}.noticeList{display:grid;gap:8px}.notice{padding:10px 12px;border-radius:14px;background:rgba(15,23,42,.82);border:1px solid rgba(148,163,184,.18);font-size:14px;line-height:1.35}.notice.attack{border-color:rgba(248,113,113,.45);background:rgba(127,29,29,.18)}.noticeMeta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:5px;color:#93c5fd;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.55px}.noticeText{color:#e2e8f0}.shop{border-color:rgba(251,191,36,.38);background:linear-gradient(135deg,rgba(113,63,18,.28),rgba(15,23,42,.9))}
.turnToast{position:fixed;left:50%;top:calc(14px + env(safe-area-inset-top));transform:translate(-50%,-130%);z-index:900;width:min(92vw,420px);padding:14px 16px;border-radius:20px;background:linear-gradient(135deg,rgba(34,197,94,.96),rgba(14,165,233,.92));color:#ecfeff;font-weight:950;text-align:center;box-shadow:0 22px 70px rgba(0,0,0,.55);transition:transform .22s ease,opacity .22s ease;opacity:0;pointer-events:none}.turnToast.open{transform:translate(-50%,0);opacity:1}.turnToast .turnCountdownNum{display:inline-grid;place-items:center;margin-top:8px;min-width:44px;height:28px;border-radius:99px;background:rgba(2,6,23,.35);border:1px solid rgba(255,255,255,.34);font-size:14px}.turnToast .count{margin-top:8px;height:5px;border-radius:99px;background:rgba(255,255,255,.26);overflow:hidden}.turnToast .bar{height:100%;width:100%;background:#fff;transform-origin:left center;animation:turnCountdown 2s linear both}@keyframes turnCountdown{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.fxStack{position:fixed;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:850;display:grid;gap:8px;pointer-events:none}.cardFx{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;padding:12px 14px;border-radius:18px;background:linear-gradient(135deg,rgba(30,41,59,.96),rgba(15,23,42,.92));border:1px solid rgba(96,165,250,.48);box-shadow:0 20px 60px #000b;animation:cardFxIn 1.65s ease both}.cardFx.attack{border-color:rgba(248,113,113,.58);background:linear-gradient(135deg,rgba(127,29,29,.96),rgba(15,23,42,.92))}.cardFx.gain{border-color:rgba(74,222,128,.58)}.cardFx .ico{font-size:34px;filter:drop-shadow(0 8px 12px #000b)}.cardFx b{display:block;color:#fff;font-size:16px}.cardFx span{display:block;color:#cbd5e1;font-size:13px;line-height:1.35}@keyframes cardFxIn{0%{opacity:0;transform:translateY(22px) scale(.96)}15%,78%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-8px) scale(.98)}}.targetDisabled{opacity:.45!important;filter:grayscale(1);box-shadow:none!important}
.modalBackdrop{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(2,6,23,.72);z-index:1000;padding:18px;backdrop-filter:blur(8px)}.modalBackdrop.open{display:flex}.confirmBox{width:min(92vw,420px);background:linear-gradient(180deg,rgba(15,23,42,.98),rgba(2,6,23,.98));border:1px solid rgba(96,165,250,.55);border-radius:24px;padding:20px;box-shadow:0 26px 80px #000c}.confirmBox b{display:block;font-size:22px;color:#fff;margin-bottom:8px}.confirmBox p{margin:0 0 14px;color:#cbd5e1;line-height:1.45}.confirmActions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.footerBtns{display:grid;grid-template-columns:1fr 1fr;gap:10px}.small{font-size:13px}.empty{padding:16px;border-radius:16px;background:rgba(15,23,42,.7);border:1px dashed rgba(148,163,184,.25);color:#94a3b8;line-height:1.45}
@media (max-width:380px){.hud{grid-template-columns:1fr}.cardrow{grid-template-columns:1fr}.actions{grid-template-columns:1fr 1fr;min-width:0}.preview{top:92px}}
</style></head><body><main>
<section class="top">
  <div><h1>📱 Main privée</h1><div class="muted">Second écran joueur : main, statut, actions et retours de table.</div></div>
  <div class="hud" id="hud" style="display:none">
    <div class="stat"><span>Joueur</span><b id="hudName">-</b></div>
    <div class="stat"><span>Tour actuel</span><b id="hudTurn">-</b></div>
    <div class="stat"><span>Pièces</span><b id="hudCoins">0</b></div>
    <div class="stat"><span>Carburant</span><b id="hudFuel">100%</b></div>
  </div>
  <div id="statusBanner" class="banner">Connexion à la table...</div>
</section>
<div id="turnToast" class="turnToast"><div id="turnToastText"></div><div id="turnToastCounter" class="turnCountdownNum">2s</div><div class="count"><div class="bar"></div></div></div>
<div id="fxStack" class="fxStack"></div>
<section class="card grid" id="claim"><input id="device" placeholder="Nom du téléphone" value="Téléphone"/><div id="players" class="grid">Chargement...</div></section>
<section class="card grid" id="private" style="display:none">
  <section class="card preview" id="preview" style="display:none"></section>
  <section class="card shop" id="shopPanel" style="display:none"></section>
  <section class="card grid"><b>Notifications</b><div id="notices" class="noticeList"><div class="muted">Aucune notification critique.</div></div></section>
  <section class="card grid"><b>Votre main</b><div id="hand" class="hand"></div></section>
  <section class="card grid" id="bagPanel"><b>Sac / objets</b><div id="bag" class="muted">Aucun objet.</div></section>
  <div class="footerBtns"><button id="refresh">Actualiser</button><button class="danger" id="release">Libérer</button></div>
</section>
<div id="confirm" class="modalBackdrop" role="dialog" aria-modal="true">
  <div class="confirmBox">
    <b id="confirmText"></b>
    <p id="confirmSub"></p>
    <div class="confirmActions"><button id="confirmYes">Confirmer</button><button id="confirmNo" class="danger">Annuler</button></div>
  </div>
</div>
<script>
let token=localStorage.getItem('mb_mobile_token')||'';
let current=null,pending=null,selectedIdx=null,lastResultId='',lastTurnKey='',turnToastTimer=null,turnToastInterval=null,lastHandKeys=[],lastNoticeIds=new Set(),lastActionFxId='';
async function api(path, opts){try{const r=await fetch(path,Object.assign({headers:{'Content-Type':'application/json'}},opts||{}));return r.json();}catch(e){return {ok:false,error:'Connexion perdue avec la table'};}}
async function load(){const room=await api('/api/room');const players=document.getElementById('players');players.innerHTML='';
if(room.ok&&room.players){room.players.forEach(p=>{const el=document.createElement('div');el.className='player';el.innerHTML='<div><b>'+esc(p.name)+'</b><div class="muted">'+esc(p.machine)+'</div></div><span class="pill '+(p.claimed?'bad':'good')+'">'+(p.claimed?'pris':'libre')+'</span>';if(!p.claimed){el.onclick=async()=>claim(p.id,p.name);el.style.cursor='pointer'}players.appendChild(el);});}
if(token){const me=await api('/api/player?token='+encodeURIComponent(token));if(me.ok){document.getElementById('claim').style.display='none';document.getElementById('private').style.display='grid';document.getElementById('hud').style.display='grid';renderPrivate(me.privateState, me.syncStatus, me.actionResult);}else{setBanner(me.error||'Téléphone non associé','warn');}}
}
async function claim(id,name){const device=document.getElementById('device').value||'Téléphone';const res=await api('/api/claim',{method:'POST',body:JSON.stringify({playerId:id,deviceName:device})});if(res.ok){token=res.token;localStorage.setItem('mb_mobile_token',token);load();}else alert(res.error||'Impossible');}
function esc(s){return String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function setBanner(text,kind){const b=document.getElementById('statusBanner');b.textContent=text||'';b.className='banner '+(kind||'');}
function showTurnToast(text){const t=document.getElementById('turnToast');const b=document.getElementById('turnToastText');const c=document.getElementById('turnToastCounter');if(!t||!b)return;b.textContent=text;t.classList.remove('open');void t.offsetWidth;t.classList.add('open');const bar=t.querySelector('.bar');if(bar){bar.style.animation='none';void bar.offsetWidth;bar.style.animation='turnCountdown 2s linear both';}if(turnToastTimer)clearTimeout(turnToastTimer);if(turnToastInterval)clearInterval(turnToastInterval);let left=2;if(c)c.textContent='2s';turnToastInterval=setInterval(()=>{left=Math.max(0,left-.5);if(c)c.textContent=(left>0?left.toFixed(left%1?1:0):0)+'s';},500);turnToastTimer=setTimeout(()=>{t.classList.remove('open');if(turnToastInterval)clearInterval(turnToastInterval);},2000);}
function cardKey(c){return c?.uid?String(c.uid):String(c?.label||'')+'|'+String(c?.type||'')+'|'+String(c?.sub||'')+'|'+String(c?.icon||'');}
function showCardFx(kind, card, text){const s=document.getElementById('fxStack');if(!s)return;const el=document.createElement('div');el.className='cardFx '+(kind==='attack'?'attack':kind==='gain'?'gain':'');el.innerHTML='<div class="ico">'+esc(card?.icon||'🎴')+'</div><div><b>'+esc(text||card?.label||'Action')+'</b><span>'+esc(card?.label||card?.desc||card?.sub||'')+'</span></div>';s.prepend(el);setTimeout(()=>el.remove(),1700);}
function usefulNotice(a){const text=String(a?.effect||a?.msg||a?.text||'');const src=String(a?.source||'');const kind=String(a?.actionType||'');if(/t[ée]l[ée]phone|synchron|envoie .*table|transport|heartbeat|debug/i.test(text+' '+src+' '+kind))return false;return !!text;}
function collectNoticeRows(actionResult){let rows=[];if(current.message)rows.push({text:current.message,type:current.messageType||'info',turn:current.turnNumber||'',source:'Table',actionType:'statut'});(current.alerts||[]).forEach(a=>rows.push({text:a,type:'attack',turn:current.turnNumber||'',source:current.name||'Vous',actionType:'état'}));(current.notices||[]).slice(-10).reverse().forEach(a=>{const row={id:a.id,text:a.effect||a.msg,type:a.type||'info',turn:a.turn,source:a.source,actionType:a.actionType,icon:a.icon||''};if(usefulNotice(row))rows.push(row);});if(actionResult&&!actionResult.pending){rows.unshift({id:actionResult.id,text:(actionResult.ok===false?'Action refusée : ':'')+(actionResult.message||'Action traitée'),type:actionResult.ok===false?'attack':'info',turn:current.turnNumber||'',source:current.name||'Vous',actionType:actionResult.ok===false?'refus':'résultat'});lastResultId=actionResult.id||lastResultId;}return rows;}
function syncMobileFx(actionResult){if(!current)return;const keys=(current.hand||[]).map(cardKey);if(lastHandKeys.length){const gained=(current.hand||[]).filter(c=>!lastHandKeys.includes(cardKey(c)));if(gained.length)showCardFx('gain',gained[0],gained.length>1?gained.length+' cartes obtenues':'Carte obtenue');}lastHandKeys=keys;const notices=collectNoticeRows(null);if(lastNoticeIds.size){notices.forEach(n=>{const id=String(n.id||n.turn+'|'+n.source+'|'+n.text);if(!lastNoticeIds.has(id)){const attack=n.type==='attack'||/attaque|incident|panne|cible/i.test(String(n.actionType)+' '+String(n.text));showCardFx(attack?'attack':'notice',{icon:n.icon},(n.icon?n.icon+' ':'')+(n.text||'Action'));}});}lastNoticeIds=new Set(notices.map(n=>String(n.id||n.turn+'|'+n.source+'|'+n.text)));if(actionResult&&!actionResult.pending&&actionResult.id!==lastActionFxId){lastActionFxId=actionResult.id;showCardFx(actionResult.ok===false?'attack':'notice',{icon:actionResult.ok===false?'⚠️':'✅'},actionResult.message||'Action traitée');}}
function renderPrivate(st,status,actionResult){current=st||null;const hand=document.getElementById('hand');if(!hand)return;
if(!current||!current.hand){setBanner(status==='waiting-state'?'Associé. La main arrivera au lancement de la partie.':'En attente de synchronisation.','warn');hand.innerHTML='<div class="empty">La main privée apparaîtra ici dès que la table publie votre état joueur.</div>';return;}
document.getElementById('hudName').textContent=current.name||'Joueur';document.getElementById('hudTurn').textContent=current.turnName||'-';document.getElementById('hudCoins').textContent=current.coins??0;document.getElementById('hudFuel').textContent=(current.fuel??100)+'%';
setBanner(current.isTurn?'À vous de jouer':('Tour de '+(current.turnName||'la table')),current.isTurn?'turn':'');
const turnKey=String(current.turnPlayerId||current.turnName||'')+'|'+String(current.isTurn);if(turnKey&&turnKey!==lastTurnKey){lastTurnKey=turnKey;showTurnToast(current.isTurn?'À vous de jouer':'Tour de '+(current.turnName||'la table'));}
syncMobileFx(actionResult);renderNotices(actionResult);renderShop();renderBag();hand.innerHTML=current.hand.map(c=>cardHtml(c)).join('');if(selectedIdx!==null)showPreview(current.hand.find(c=>c.index===selectedIdx)||current.hand[0]);}
function renderNotices(actionResult){const n=document.getElementById('notices');let rows=collectNoticeRows(actionResult).slice(0,8);n.innerHTML=rows.length?rows.map(r=>'<div class="notice '+(r.type==='attack'?'attack':'')+'"><div class="noticeMeta"><span>T'+esc(r.turn||'-')+'</span><span>'+esc(r.source||'Table')+'</span><span>'+esc(r.actionType||'info')+'</span></div><div class="noticeText">'+esc((r.icon?r.icon+' ':'')+(r.text||''))+'</div></div>').join(''):'<div class="muted">Aucune notification critique.</div>';}
function renderShop(){const el=document.getElementById('shopPanel');if(!current.shop){el.style.display='none';return;}el.style.display='grid';el.innerHTML='<b>🏪 Boutique active</b><div class="muted">'+esc(current.shop.title||'Boutique')+'</div><div class="banner">C’est votre séquence d’achat. Les détails restent privés à la table.</div>';}
function renderBag(){const bag=document.getElementById('bag');const inv=current.inventory||[];bag.innerHTML=inv.length?inv.map(c=>'<span class="pill">'+esc(c.icon)+' '+esc(c.label)+'</span>').join(' '):'Aucun objet.';}
function cardHtml(c){const cls=c.playable?'good':'bad';return '<article class="cardrow '+(selectedIdx===c.index?'selected':'')+'" data-card="'+c.index+'"><div><div class="cardtitle"><span class="cardicon">'+esc(c.icon)+'</span><span>'+esc(c.label)+'</span></div><div class="desc">'+esc(c.desc||c.sub||c.type)+'</div><div class="mini '+cls+'">'+(c.playable?'Jouable maintenant':esc(c.reason||'Non jouable maintenant'))+'</div></div><div class="actions">'+actionButtons(c)+'</div></article>';}
function showPreview(c){const p=document.getElementById('preview');if(!c){p.style.display='none';return;}p.style.display='block';p.innerHTML='<div class="big">'+esc(c.icon)+'</div><h2>'+esc(c.label)+'</h2><div class="desc">'+esc(c.desc||c.sub||c.type)+'</div><div class="mini '+(c.playable?'good':'bad')+'">'+(c.playable?'Cette carte peut être jouée si la cible est valide.':esc(c.reason||'Action indisponible'))+'</div>';}
function actionButtons(c){const disabled=!current?.isTurn||!c.playable;if(disabled)return '<button disabled style="opacity:.45">Attendre</button>';if((c.type==='attack'||c.type==='action')&&(c.isZone||c.isChaos))return '<button data-play="'+c.index+'" data-kind="self">Jouer</button><button data-discard="'+c.index+'" class="danger">Défausser</button>';if(c.type==='attack'||c.type==='action'){const targets=(c.targets&&c.targets.length?c.targets:(current.targets||[]));return targets.map(t=>'<button '+(t.valid===false?'disabled class="targetDisabled" title="'+esc(t.reason||'Cible protégée')+'"':'')+' data-play="'+c.index+'" data-kind="'+t.kind+'" data-index="'+t.index+'">Cibler '+esc(t.name)+(t.valid===false?' 🔒':'')+'</button>').join('')+'<button data-discard="'+c.index+'" class="danger">Défausser</button>';}return '<button data-play="'+c.index+'" data-kind="self">Jouer</button><button data-discard="'+c.index+'" class="danger">Défausser</button>';}
function askConfirm(label, sub, action, payload){pending={action,payload};document.getElementById('confirmText').textContent=label;document.getElementById('confirmSub').textContent=sub||'';document.getElementById('confirm').classList.add('open');}
document.addEventListener('click',async e=>{const p=e.target;const row=p.closest?.('[data-card]');if(row&&!p.dataset.play&&!p.dataset.discard){selectedIdx=+row.dataset.card;showPreview(current?.hand?.find(c=>c.index===selectedIdx));document.querySelectorAll('.cardrow').forEach(x=>x.classList.toggle('selected',+x.dataset.card===selectedIdx));}if(p.dataset.play){const c=current?.hand?.find(x=>x.index===+p.dataset.play);askConfirm('Jouer '+(c?.label||'cette carte')+' ?',(c?.desc||c?.sub||''),'play-card',{cardIndex:+p.dataset.play,targetKind:p.dataset.kind,targetIndex:p.dataset.index==='ai'?'ai':(p.dataset.index?+p.dataset.index:null)});}if(p.dataset.discard){const c=current?.hand?.find(x=>x.index===+p.dataset.discard);askConfirm('Défausser '+(c?.label||'cette carte')+' ?','Cette action est définitive.','discard-card',{cardIndex:+p.dataset.discard});}});
document.getElementById('confirmYes').onclick=async()=>{if(!pending)return;document.getElementById('confirm').classList.remove('open');const res=await api('/api/action',{method:'POST',body:JSON.stringify({token,action:pending.action,payload:pending.payload})});pending=null;setBanner(res.ok?'Action en cours...':(res.error||'Action refusée'),res.ok?'turn':'warn');setTimeout(load,250);};
document.getElementById('confirmNo').onclick=()=>{pending=null;document.getElementById('confirm').classList.remove('open');};
document.getElementById('refresh').onclick=load;document.getElementById('release').onclick=async()=>{await api('/api/release',{method:'POST',body:JSON.stringify({token})});localStorage.removeItem('mb_mobile_token');token='';location.reload();};
function schedule(){load().finally(()=>setTimeout(schedule,document.hidden?1800:850));}schedule();
</script></main></body></html>`;
    }

    function readJson(req) {
        return new Promise(resolve => {
            let body = '';
            req.on('data', c => { body += c; if(body.length > 1e6) req.destroy(); });
            req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch(e){ resolve({}); } });
        });
    }

    function startMobileServer() {
        if(!mobileEnabled || mobileServer) return Promise.resolve(null);
        return new Promise((resolve, reject) => {
            mobileServer = http.createServer(async (req, res) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                if(req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
                if(req.url === '/' || req.url === '/mobile') {
                    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'}); res.end(mobilePageHtml()); return;
                }
                if(req.url === '/api/room') {
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify({ok:true, players:allClaimablePlayers(), mobileControllers:Array.from(mobileControllers.values()).map(m=>({
                        playerId:m.playerId,
                        deviceName:m.deviceName,
                        lastSeen:m.lastSeen,
                        connectedAt:m.connectedAt,
                        syncedAt:m.syncedAt || 0,
                        syncStatus: mobilePrivateState.has(m.playerId) ? 'synced' : 'waiting-state',
                    }))}));
                    return;
                }
                if(req.url && (req.url.startsWith('/api/player') || req.url.startsWith('/api/state'))) {
                    const u = new URL(req.url, 'http://127.0.0.1');
                    const token = u.searchParams.get('token');
                    const ctrl = token && mobileControllers.get(token);
                    if(ctrl) ctrl.lastSeen = Date.now();
                    const player = ctrl ? allClaimablePlayers().find(p => p.id === ctrl.playerId) : null;
                    const privateState = ctrl ? mobilePrivateState.get(ctrl.playerId) || null : null;
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify({
                        ok:!!ctrl,
                        player,
                        privateState,
                        actionResult: ctrl ? (mobileActionResults.get(ctrl.token) || null) : null,
                        syncStatus: ctrl ? (privateState ? 'synced' : 'waiting-state') : 'unclaimed',
                        controller:ctrl ? {
                            playerId:ctrl.playerId,
                            deviceName:ctrl.deviceName,
                            lastSeen:ctrl.lastSeen,
                            syncedAt:ctrl.syncedAt || 0,
                        } : null
                    }));
                    return;
                }
                if(req.url === '/api/claim' && req.method === 'POST') {
                    const data = await readJson(req);
                    const player = allClaimablePlayers().find(p => p.id === data.playerId);
                    const taken = findMobileTokenForPlayer(data.playerId);
                    if(!player || taken) {
                        res.writeHead(409, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'Joueur indisponible'})); return;
                    }
                    const token = crypto.randomBytes(18).toString('hex');
                    mobileControllers.set(token, {
                        token,
                        playerId:data.playerId,
                        deviceName:String(data.deviceName||'Téléphone').slice(0,32),
                        connectedAt:Date.now(),
                        lastSeen:Date.now(),
                        syncedAt:mobilePrivateState.has(data.playerId) ? Date.now() : 0,
                    });
                    broadcast({type:'mobile-roster', roster:rosterPayload()});
                    res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:true, token}));
                    return;
                }
                if(req.url === '/api/release' && req.method === 'POST') {
                    const data = await readJson(req);
                    if(data.token) mobileControllers.delete(data.token);
                    broadcast({type:'mobile-roster', roster:rosterPayload()});
                    res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:true}));
                    return;
                }
                if(req.url === '/api/action' && req.method === 'POST') {
                    const data = await readJson(req);
                    const ctrl = data.token && mobileControllers.get(data.token);
                    if(!ctrl) { res.writeHead(403, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'Téléphone non associé'})); return; }
                    ctrl.lastSeen = Date.now();
                    const queued = {id:Date.now() + ':' + Math.random().toString(16).slice(2), t:Date.now(), playerId:ctrl.playerId, action:data.action, payload:data.payload || {}};
                    queued.token = data.token;
                    mobileActions.push(queued);
                    mobileActionTokens.set(queued.id, data.token);
                    mobileActionResults.set(data.token, {id:queued.id, pending:true, ok:null, message:'Action en cours...'});
                    try { onMessage('mobile:' + ctrl.playerId, {type:'mobile-action', ...queued}); } catch(e) { onError(e); }
                    res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:true, actionId:queued.id}));
                    return;
                }
                res.writeHead(404, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'not found'}));
            });
            mobileServer.once('error', reject);
            mobileServer.listen(mobilePort, () => resolve({mobilePort}));
        });
    }

    function handleClientMessage(clientId, msg) {
        const c = clients.get(clientId);
        if (!c) return;
        if (msg.type === 'hello') {
            c.name = String(msg.name || `Client ${clientId}`).slice(0, 24);
            c.localPlayers = Math.max(1, Math.min(7, parseInt(msg.localPlayers || 1, 10)));
            c.playerNames = Array.isArray(msg.playerNames)
                ? msg.playerNames.slice(0, c.localPlayers).map((n, i) => String(n || '').trim() || `${c.name} #${i + 1}`)
                : Array.from({ length: c.localPlayers }, (_, i) => `${c.name} #${i + 1}`);
            send(c.socket, { type:'welcome', clientId, hostName: opts.hostName || 'Hôte', protocolVersion: PROTOCOL_VERSION });
            broadcast(rosterPayload());
            if (lastPublicState) send(c.socket, { type:'state', state:lastPublicState });
            if (clientPrivateState.has(clientId)) send(c.socket, { type:'private-state', state:clientPrivateState.get(clientId) });
        } else if (msg.type === 'ping') {
            send(c.socket, { type:'pong', t: Date.now() });
        } else if (msg.type === 'remote-action' || msg.type === 'action') {
            // SEC: vérifier que le playerId déclaré appartient bien à ce client.
            // Les slots d'un client TCP sont de la forme "${clientId}:${localIndex}".
            const expectedPrefix = String(clientId) + ':';
            if (!msg.playerId || !String(msg.playerId).startsWith(expectedPrefix)) {
                send(c.socket, { type: 'error', message: 'playerId invalide pour ce client' });
                onLog(`[SEC] Client ${clientId} (${c.addr}) a déclaré playerId='${msg.playerId}' — refusé.`);
                return;
            }
            remoteActions.push({id:Date.now() + ':' + Math.random().toString(16).slice(2), t:Date.now(), clientId, playerId:msg.playerId, action:msg.action, payload:msg.payload || {}});
            try { onMessage(clientId, msg); } catch(e) { onError(e); }
        } else {
            // Délègue à l'app (actions de jeu)
            try { onMessage(clientId, msg); } catch(e) { onError(e); }
        }
    }

    function bindSocket(socket) {
        const id = nextClientId++;
        const addr = `${socket.remoteAddress || '?'}:${socket.remotePort || '?'}`;
        const client = { id, socket, name: '', localPlayers: 1, addr, buffer: '', ready: false };
        clients.set(id, client);
        onClientJoin(client);
        onStatus({ running, port, mobilePort: mobileEnabled ? mobilePort : null, clientCount: clients.size });

        socket.setEncoding('utf8');
        socket.on('data', (chunk) => {
            client.buffer += chunk;
            let nl;
            while ((nl = client.buffer.indexOf('\n')) !== -1) {
                const line = client.buffer.slice(0, nl).trim();
                client.buffer = client.buffer.slice(nl + 1);
                if (!line) continue;
                if (/^(GET|POST|PUT|DELETE|OPTIONS|HEAD)\s/i.test(line)) {
                    send(socket, {type:'error', message:'Port de jeu TCP JSON. Utilisez le client du jeu, pas un navigateur.'});
                    disconnectClient(id, 'http probe');
                    return;
                }
                if (line[0] !== '{') {
                    // Probes reseau, clients HTTP/TLS ou vieux executables peuvent envoyer
                    // des octets non-protocole sur le port TCP. Ce n'est pas une erreur
                    // de room : on ferme proprement sans remonter de bannière hôte rouge.
                    send(socket, {type:'error', message:'Protocole invalide'});
                    disconnectClient(id, 'non-json probe');
                    return;
                }
                try {
                    const msg = JSON.parse(line);
                    if (!msg || typeof msg !== 'object' || Array.isArray(msg)) {
                        send(socket, {type:'error', message:'Message réseau invalide'});
                        continue;
                    }
                    if (!client.ready && msg.type !== 'hello') {
                        send(socket, {type:'error', message:'Handshake requis'});
                        disconnectClient(id, 'missing hello');
                        return;
                    }
                    if (msg.type === 'hello') client.ready = true;
                    handleClientMessage(id, msg);
                } catch (e) {
                    send(socket, {type:'error', message:'JSON invalide ignoré'});
                    onLog('Invalid JSON ignored from client ' + id + ': ' + e.message);
                    if (!client.ready) {
                        disconnectClient(id, 'invalid json before hello');
                        return;
                    }
                }
            }
            if (client.buffer.length > 1e6) {
                disconnectClient(id, 'buffer overflow');
            }
        });
        socket.on('close', () => disconnectClient(id, 'closed'));
        socket.on('error', (err) => { onError(err); disconnectClient(id, 'error'); });
    }

    return {
        start() {
            if (running) return Promise.resolve({ running:true, port });
            return new Promise((resolve, reject) => {
                server = net.createServer(bindSocket);
                server.once('error', (err) => {
                    onError(err);
                    running = false;
                    reject(err);
                });
                server.listen(port, async () => {
                    running = true;
                    try { await startMobileServer(); } catch(e) { onError(e); }
                    onStatus({ running, port, mobilePort: mobileEnabled ? mobilePort : null, clientCount: 0 });
                    resolve({ running, port, mobilePort: mobileEnabled ? mobilePort : null });
                });
            });
        },
        stop() {
            if (!running) return Promise.resolve();
            return new Promise((resolve) => {
                for (const id of Array.from(clients.keys())) disconnectClient(id, 'server stopping');
                mobileControllers.clear();
                mobilePrivateState.clear();
                mobileActions.length = 0;
                mobileActionTokens.clear();
                mobileActionResults.clear();
                remoteActions.length = 0;
                if (mobileServer) {
                    try { mobileServer.close(); } catch(e){}
                    mobileServer = null;
                }
                if (server) server.close(() => {
                    running = false;
                    onStatus({ running, port, mobilePort: mobileEnabled ? mobilePort : null, clientCount: 0 });
                    resolve();
                });
            });
        },
        broadcast,
        sendTo(clientId, obj) {
            const c = clients.get(clientId);
            if (obj && obj.type === 'private-state') clientPrivateState.set(clientId, obj.state || null);
            return c ? send(c.socket, obj) : false;
        },
        getClients() {
            return Array.from(clients.values()).map(c => ({
                id:c.id,
                name:c.name,
                localPlayers:c.localPlayers,
                playerNames: c.playerNames || [],
                addr:c.addr
            }));
        },
        getRoster() { return rosterPayload(); },
        setHostPlayers(names) {
            hostPlayerNames = Array.isArray(names) ? names.map((n,i)=>String(n || `Joueur local ${i+1}`).slice(0,24)) : [];
            broadcast(rosterPayload());
        },
        setMobileState(stateByPlayer) {
            mobilePrivateState.clear();
            if (stateByPlayer && typeof stateByPlayer === 'object') {
                for (const [playerId, state] of Object.entries(stateByPlayer)) {
                    mobilePrivateState.set(playerId, state);
                }
            }
            const now = Date.now();
            let changed = false;
            for (const ctrl of mobileControllers.values()) {
                const hasPrivateState = mobilePrivateState.has(ctrl.playerId);
                if (hasPrivateState && !ctrl.syncedAt) {
                    ctrl.syncedAt = now;
                    changed = true;
                    onLog(`Mobile controller synced: ${ctrl.deviceName || 'Téléphone'} -> ${ctrl.playerId}`);
                }
                if (!hasPrivateState && ctrl.syncedAt) {
                    ctrl.syncedAt = 0;
                    changed = true;
                }
            }
            if (changed) broadcast({type:'mobile-roster', roster:rosterPayload()});
        },
        drainMobileActions() {
            const out = mobileActions.splice(0, mobileActions.length);
            return out;
        },
        completeMobileAction(actionId, ok, message) {
            const token = mobileActionTokens.get(actionId);
            if (!token) return false;
            mobileActionResults.set(token, {id:actionId, pending:false, ok:!!ok, message:String(message || (ok ? 'Action validée.' : 'Action refusée.')).slice(0,160), t:Date.now()});
            mobileActionTokens.delete(actionId);
            return true;
        },
        drainRemoteActions() {
            const out = remoteActions.splice(0, remoteActions.length);
            return out;
        },
        getStatus() { return { running, port, mobilePort: mobileEnabled ? mobilePort : null, clientCount: clients.size }; },
        isRunning() { return running; },
        port,
        mobilePort,
        PROTOCOL_VERSION,
    };
}

module.exports = { createServer, DEFAULT_PORT, PROTOCOL_VERSION };
