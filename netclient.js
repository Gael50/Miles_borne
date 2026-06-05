// ─── netclient.js — Client TCP pour rejoindre une partie ────────────────────
// Aucune dépendance externe : module `net` natif Node.
//
// Utilisation :
//   const { createClient } = require('./netclient.js');
//   const cli = createClient({
//       host: '192.168.1.42', port: 7891,
//       onMessage: (msg) => { ... },
//       onOpen: () => { ... },
//       onClose: (reason) => { ... },
//       onError: (err) => { ... },
//   });
//   cli.connect();
//   cli.send({type:'hello', name:'Alice', localPlayers:2, version:1});
//   cli.disconnect();
//
// Protocol identique à server.js (line-delimited JSON).

const net = require('net');

const DEFAULT_PORT = 7891;
const CONNECT_TIMEOUT_MS = 5000;

function createClient(opts = {}) {
    const host = opts.host || '127.0.0.1';
    const port = opts.port || DEFAULT_PORT;
    const onMessage = opts.onMessage || (() => {});
    const onOpen = opts.onOpen || (() => {});
    const onClose = opts.onClose || (() => {});
    const onError = opts.onError || ((e) => { console.error('[client]', e); });

    let socket = null;
    let buffer = '';
    let connected = false;
    let connectTimer = null;

    function send(obj) {
        if (!socket || socket.destroyed || !connected) return false;
        try {
            socket.write(JSON.stringify(obj) + '\n');
            return true;
        } catch (e) { onError(e); return false; }
    }

    function disconnect(reason) {
        if (connectTimer) { clearTimeout(connectTimer); connectTimer = null; }
        if (!socket) return;
        try { socket.end(); } catch(e){}
        try { socket.destroy(); } catch(e){}
        socket = null;
        if (connected) { connected = false; onClose(reason || 'manual'); }
    }

    function connect() {
        return new Promise((resolve, reject) => {
            if (connected) { resolve(); return; }
            buffer = '';
            socket = new net.Socket();
            socket.setEncoding('utf8');

            // Timeout de connexion explicite
            connectTimer = setTimeout(() => {
                onError(new Error(`Connect timeout after ${CONNECT_TIMEOUT_MS}ms (${host}:${port})`));
                try { socket && socket.destroy(); } catch(e){}
                reject(new Error('Timeout'));
            }, CONNECT_TIMEOUT_MS);

            socket.once('connect', () => {
                if (connectTimer) { clearTimeout(connectTimer); connectTimer = null; }
                connected = true;
                onOpen();
                resolve();
            });

            socket.on('data', (chunk) => {
                buffer += chunk;
                let nl;
                while ((nl = buffer.indexOf('\n')) !== -1) {
                    const line = buffer.slice(0, nl).trim();
                    buffer = buffer.slice(nl + 1);
                    if (!line) continue;
                    if (line[0] !== '{') {
                        onError(new Error('Réponse réseau non protocolaire ignorée'));
                        continue;
                    }
                    try {
                        const msg = JSON.parse(line);
                        if (!msg || typeof msg !== 'object' || Array.isArray(msg)) {
                            onError(new Error('Réponse réseau invalide ignorée'));
                            continue;
                        }
                        onMessage(msg);
                    } catch (e) { onError(new Error('Bad JSON: ' + e.message)); }
                }
                if (buffer.length > 1e6) {
                    onError(new Error('Buffer overflow'));
                    disconnect('overflow');
                }
            });

            socket.on('error', (err) => {
                if (connectTimer) { clearTimeout(connectTimer); connectTimer = null; }
                onError(err);
                if (!connected) reject(err);
                disconnect('error');
            });

            socket.on('close', () => {
                if (connected) { connected = false; onClose('closed'); }
            });

            try {
                socket.connect(port, host);
            } catch (e) {
                if (connectTimer) { clearTimeout(connectTimer); connectTimer = null; }
                onError(e); reject(e);
            }
        });
    }

    return {
        connect,
        disconnect,
        send,
        isConnected() { return connected; },
        getEndpoint() { return { host, port }; },
    };
}

module.exports = { createClient, DEFAULT_PORT };
