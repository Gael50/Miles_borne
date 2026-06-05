// ─── netinfo.js — Détection des interfaces réseau locales ─────────────────
// Aucune dépendance externe : utilise os.networkInterfaces() natif Node.
//
// Retourne un tableau d'IPs IPv4 non-internes triées par pertinence :
//   1) LAN physique probable (Wi-Fi / Ethernet)
//   2) Hamachi
//   3) autres LAN privés / VPN non identifiés
//   4) interfaces virtuelles (VirtualBox, WSL, Docker, Hyper-V...)
// Chaque entrée a la forme { name, address, family, internal, isHamachi, isPrivate, isVirtual, score }
//
// Utilisation :
//   const { getLocalIPs, getBestIP } = require('./netinfo.js');
//   const ips = getLocalIPs();        // [{name:'Wi-Fi', address:'192.168.1.42', ...}, ...]
//   const best = getBestIP();          // { name:'Hamachi', address:'25.x.x.x', ... } ou null
//
// Détection Hamachi :
//   - sous Windows, l'adaptateur s'appelle souvent "Hamachi" ou contient "Hamachi"
//   - LogMeIn Hamachi utilise les plages 25.0.0.0/8 (legacy) et 7.x.x.x (récent)

const os = require('os');

// Plages d'IP Hamachi connues (préfixes premier octet)
const HAMACHI_PREFIXES = ['25.', '7.'];

function isHamachiAddress(addr, ifaceName) {
    if (typeof addr !== 'string') return false;
    // Nom de l'interface
    const name = (ifaceName || '').toLowerCase();
    if (name.includes('hamachi') || name.includes('logmein')) return true;
    // Préfixe IP
    return HAMACHI_PREFIXES.some(p => addr.startsWith(p));
}

function isPrivateLAN(addr) {
    if (typeof addr !== 'string') return false;
    if (addr.startsWith('192.168.')) return true;
    if (addr.startsWith('10.')) return true;
    if (addr.startsWith('172.')) {
        const second = parseInt(addr.split('.')[1] || '0', 10);
        return second >= 16 && second <= 31;
    }
    return false;
}

function isVirtualInterface(ifaceName) {
    const name = String(ifaceName || '').toLowerCase();
    return [
        'virtualbox', 'vmware', 'hyper-v', 'vethernet', 'wsl',
        'docker', 'npcap', 'loopback', 'bluetooth', 'zerotier',
        'tailscale', 'tap-windows', 'teredo'
    ].some(x => name.includes(x));
}

function isVirtualAddress(addr) {
    if (typeof addr !== 'string') return false;
    // Plages tres frequentes d'adaptateurs host-only / Docker / anciens stacks VM.
    if (addr.startsWith('192.168.56.')) return true; // VirtualBox Host-Only par defaut
    if (addr.startsWith('192.168.99.')) return true; // Docker Toolbox / VM legacy
    if (addr.startsWith('172.17.') || addr.startsWith('172.18.') || addr.startsWith('172.19.')) return true;
    if (addr.startsWith('169.254.')) return true;   // link-local, rarement partageable
    return false;
}

function isPhysicalLanName(ifaceName) {
    const name = String(ifaceName || '').toLowerCase();
    return [
        'wi-fi', 'wifi', 'wireless', 'wlan', 'ethernet',
        'local area connection', 'connexion au réseau local', 'réseau local'
    ].some(x => name.includes(x));
}

function scoreInterface(entry) {
    let score = 0;
    if (entry.isPrivate) score += 100;
    if (String(entry.name || '').toLowerCase().includes('wi-fi') || String(entry.name || '').toLowerCase().includes('wifi')) score += 120;
    else if (isPhysicalLanName(entry.name)) score += 85;
    if (entry.address.startsWith('192.168.')) score += 30;
    if (entry.address.startsWith('10.')) score += 18;
    if (entry.address.startsWith('172.')) score += 12;
    if (entry.isHamachi) score += 55;
    if (entry.isVirtual) score -= 90;
    return score;
}

function getLocalIPs() {
    const ifaces = os.networkInterfaces();
    const out = [];
    for (const [name, addrs] of Object.entries(ifaces)) {
        if (!Array.isArray(addrs)) continue;
        for (const a of addrs) {
            if (!a || a.family !== 'IPv4' && a.family !== 4) continue;
            if (a.internal) continue;                 // exclut 127.0.0.1 et loopback
            if (!a.address || a.address === '0.0.0.0') continue;
            const entry = {
                name,
                address: a.address,
                family: 'IPv4',
                internal: false,
                isHamachi: isHamachiAddress(a.address, name),
                isPrivate: isPrivateLAN(a.address),
                isVirtual: isVirtualInterface(name) || isVirtualAddress(a.address),
            };
            entry.score = scoreInterface(entry);
            out.push(entry);
        }
    }
    // Tri : IP réellement partageable en premier. Hamachi reste détecté et visible,
    // mais ne vole plus la priorité à un vrai Wi-Fi/Ethernet local.
    out.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name);
    });
    return out;
}

function getBestIP() {
    const all = getLocalIPs();
    return all.length > 0 ? all[0] : null;
}

module.exports = { getLocalIPs, getBestIP, isHamachiAddress, isPrivateLAN, isVirtualInterface, isVirtualAddress };
