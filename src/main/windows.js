// src/main/windows.js
const { BrowserWindow, BrowserView } = require("electron");
const path = require("path");
const TOPBAR_HEIGHT = 60;

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Oort Cloud",
    width: 1366,
    height: 768,
    frame: false,
    fullscreen: true,
    kiosk: true,
    // alwaysOnTop should NOT be true permanently; we will use temporary tops
    webPreferences: {
      preload: path.join(__dirname, "../renderer/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  /* -----------------------------------------------------------
     🔒 BLOCK CLOSE / HIDE / MINIMIZE
  ----------------------------------------------------------- */
  mainWindow.on("close", (e) => e.preventDefault());
  mainWindow.on("before-quit", (e) => e.preventDefault());
  mainWindow.on("session-end", (e) => e.preventDefault());
  mainWindow.on("minimize", (e) => e.preventDefault());
  mainWindow.on("hide", (e) => e.preventDefault());

  /* -----------------------------------------------------------
     🔥 AUTO-REFOCUS SECURITY (Option B)
     If macOS switches to Notes (Fn+Q) or Cmd+Tab → refocus back
  ----------------------------------------------------------- */
  mainWindow.on("blur", () => {
    setTimeout(() => {
      try {
        if (mainWindow.isDestroyed()) return;

        // Bring window back
        mainWindow.show();
        mainWindow.focus();

        // temporarily force high z-order
        mainWindow.setAlwaysOnTop(true, "screen-saver");

        // after short delay remove it to avoid breaking rendering
        setTimeout(() => {
          try {
            if (!mainWindow.isDestroyed()) {
              mainWindow.setAlwaysOnTop(false);
            }
          } catch {}
        }, 50);
      } catch (e) {
        console.warn("Refocus error:", e);
      }
    }, 20);
  });

  /* -----------------------------------------------------------
     Load login page
  ----------------------------------------------------------- */
  mainWindow.loadFile(path.join(__dirname, "../renderer/pages/login.html"));

  /* -----------------------------------------------------------
     BrowserView for exam/admin content
  ----------------------------------------------------------- */
  const view = new BrowserView({
    webPreferences: {
      partition: "persist:mainview",
      preload: path.join(__dirname, "../renderer/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false,
    },
  });

  mainWindow._examView = view;

  return { mainWindow, view };
}

module.exports = { createMainWindow };
