import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null;
const url = path.join(__dirname, "..", "index.html");
const isDevelopment = process.env.ELECTRON_DEV == "dev";

function createWindow(): void {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800
  });

  mainWindow.loadFile(url);

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("ready", createWindow);
