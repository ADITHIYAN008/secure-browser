// src/main/main.js
const { app, globalShortcut, Menu } = require("electron");
const path = require("path");

const windows = require("./windows");
const ipc = require("./ipc");
const shortcutBlocker = require("./security/shortcutBlocker");
const kiosk = require("./security/kiosk");

let mainWindow, view;

/* ------------------------------
   🔒 Remove App Menu (blocks Cmd+Q, Cmd+W, Cmd+H, etc.)
--------------------------------*/
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
});

/* ------------------------------
   🔒 Disable keyboard shortcuts
--------------------------------*/
function disableShortcuts() {
  const blocked = [
    "CommandOrControl+R",
    "CommandOrControl+Shift+R",
    "CommandOrControl+N",
    "CommandOrControl+T",
    "CommandOrControl+W",
    "CommandOrControl+Shift+I",
    "F12",
    "F11",
    "Alt+Tab",
  ];

  // 💥 Block quit keys
  globalShortcut.register("Q", () => {});
  globalShortcut.register("Command+Q", () => {});
  globalShortcut.register("CommandOrControl+Q", () => {});
  globalShortcut.register("Control+Q", () => {});
  globalShortcut.register("fn+Q", () => {});

  blocked.forEach((shortcut) => {
    globalShortcut.register(shortcut, () => {});
  });
}

/* ------------------------------
   🚀 Main initialization
--------------------------------*/
function init() {
  ({ mainWindow, view } = windows.createMainWindow());

  kiosk.apply(mainWindow);
  shortcutBlocker.register();
  ipc.init({ mainWindow, view });

  disableShortcuts();
}

/* ------------------------------
   🚀 App Ready
--------------------------------*/
app.whenReady().then(init);

/* ------------------------------
   👊 Prevent closing the app
--------------------------------*/
app.on("before-quit", (e) => e.preventDefault());
app.on("will-quit", (e) => e.preventDefault());

app.on("window-all-closed", (e) => {
  e.preventDefault(); // DON'T QUIT
});
