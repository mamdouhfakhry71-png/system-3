const { app, BrowserWindow, shell, Menu, session } = require('electron');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
const path = require('path');

function createWindow() {
  Menu.setApplicationMenu(null);
  const w = new BrowserWindow({
    width: 1200, height: 800, minWidth: 420, autoHideMenuBar: true, title: 'نظام محل الإكسسوارات',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  w.loadFile(path.join(__dirname, 'index.html'));
  // روابط الواتساب تتفتح في المتصفح/تطبيق الواتساب، وأي حاجة تانية تتمنع
  w.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  w.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file://')) e.preventDefault(); });
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(perm === 'media'));
    createWindow();
  });
  app.on('window-all-closed', () => app.quit());
}
