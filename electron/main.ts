import electron, { app, BrowserWindow } from "electron";

import path from "path";
import isDev from "electron-is-dev";
import electronDebug from "electron-debug";
// import { publishToLocalMqtt } from './localMqtt';

electronDebug({
  isEnabled: isDev,
  showDevTools: false, // don't show the devTools immediately
  devToolsMode: "detach",
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 720,
    height: 512,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
      devTools: isDev,
    },
  });
  mainWindow.removeMenu();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:5000"
      : `file://${path.join(__dirname, "../index.html")}`
  );

  // setup development tools
  if (isDev) {
    // eslint-disable-next-line global-require
    const electronDevtoolsInstaller = require("electron-devtools-installer");
    const installDevtoolsExtension = electronDevtoolsInstaller.default;
    const {
      REDUX_DEVTOOLS,
      REACT_DEVELOPER_TOOLS,
      REACT_PERF,
    } = electronDevtoolsInstaller;
    installDevtoolsExtension([
      REDUX_DEVTOOLS,
      REACT_DEVELOPER_TOOLS,
      REACT_PERF,
    ]);
  }
  mainWindow.on("closed", () => (mainWindow = null));
  // publishToLocalMqtt('initEvent', 'Application Initialized');
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
