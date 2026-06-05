const { app, BrowserWindow } = require('electron')
const path = require('path')

console.time('[Main] App Ready');
console.log('[Main] Process started');

function createWindow () {
  console.time('[Main] Window Creation');
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#040b1a',
    show: false, // Show when ready to avoid visual flash
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.maximize()

  let isShown = false;
  win.once('ready-to-show', () => {
    if (isShown) return;
    isShown = true;
    console.timeEnd('[Main] Window Creation');
    console.log('[Main] Window ready to show (event fired)');
    win.show()
  })

  // Fallback: Si le renderer plante ou met trop de temps, on force l'affichage pour ne pas avoir un process fantôme
  setTimeout(() => {
    if (!isShown) {
      isShown = true;
      console.timeEnd('[Main] Window Creation');
      console.warn('[Main] Window ready-to-show event timed out. Forcing show.');
      win.show();
    }
  }, 3000);

  win.webContents.on('did-finish-load', () => {
    console.log('[Main] WebContents finished loading');
  });

  win.webContents.on('crashed', (e) => {
    console.error('[Main] WebContents crashed!', e);
  });

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  console.timeEnd('[Main] App Ready');
  createWindow();
})

app.on('window-all-closed', () => {
  console.log('[Main] All windows closed');
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  console.log('[Main] App quit');
})
