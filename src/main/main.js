const path = require("path");
const { app } = require("electron");

const windows = require("./windows");
const ipc = require("./ipc");
const shortcutBlocker = require("./security/shortcutBlocker");
const kiosk = require("./security/kiosk");

let mainWindow, view;

function init() {
  ({ mainWindow, view } = windows.createMainWindow());

  ipc.init({ mainWindow, view });

  kiosk.apply(mainWindow);
  shortcutBlocker.register();
}

app.whenReady().then(init);

app.on("window-all-closed", () => {
  app.quit();
});
