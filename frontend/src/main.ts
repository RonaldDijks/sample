import { app, BrowserWindow, dialog, ipcMain } from "electron";

import { predictFolder } from "./core/backend";

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

ipcMain.handle("open-folder", async () => {
  if (!window) {
    throw new Error("Window was undefined.");
  }
  const folder = await dialog.showOpenDialog(window, {
    properties: ["openDirectory"]
  });
  const folderPath = folder.filePaths[0];
  if (!folderPath) {
    throw new Error("File path was empty.");
  }
  const predictions = await predictFolder(folderPath);
  return predictions;
});
