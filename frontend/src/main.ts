import { app, BrowserWindow } from "electron";

let window: BrowserWindow | null;

function createWindow(): void {
  window = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadFile("index.html");

  if (process.env.ELECTRON_DEV == "dev") {
    window.webContents.openDevTools();
  }

  window.on("closed", () => {
    window = null;
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});

app.on("ready", createWindow);
