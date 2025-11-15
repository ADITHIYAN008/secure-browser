const { globalShortcut } = require("electron");

function register() {
  try {
    globalShortcut.register("CommandOrControl+R", () => {});
    globalShortcut.register("CommandOrControl+W", () => {});
    globalShortcut.register("Alt+F4", () => {});
    globalShortcut.register("CommandOrControl+Q", () => {});
    globalShortcut.register("CommandOrControl+Shift+Q", () => {
      process.exit(0);
    });
  } catch (e) {
    console.warn("shortcut register failed", e);
  }
}

module.exports = { register };
