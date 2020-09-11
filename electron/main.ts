import electron, { app, BrowserWindow, screen } from 'electron';
import { setupMainHandler } from 'eiphop';

import path from 'path';
import isDev from 'electron-is-dev';
import electronDebug from 'electron-debug';
import ipcActions from './ipcActions';
import { BrowserWindowConstructorOptions } from 'electron/main';

electronDebug({
	isEnabled: isDev,
	showDevTools: true,
	devToolsMode: 'right',
});

setupMainHandler(electron, {
	...ipcActions,
	quitApp: ipcActions.quitApp(app),
	restartApp: ipcActions.restartApp(app),
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
	let devOptions: BrowserWindowConstructorOptions = {};
	if (isDev) {
		// in development, place the application on the secondary display
		const displays = screen.getAllDisplays();
		let externalDisplay = null;
		for (let i in displays) {
			if (displays[i].bounds.x !== 0 || displays[i].bounds.y !== 0) {
				externalDisplay = displays[i];
				break;
			}
		}
		if (externalDisplay) {
			devOptions = {
				...devOptions,
				x: externalDisplay.bounds.x,
				y: externalDisplay.bounds.y,
				width: externalDisplay.bounds.width,
				height: externalDisplay.bounds.height,
			};
		}
	}
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 800,
		backgroundColor: '#ffffff',
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, './preload.js'),
			devTools: isDev,
		},
		...devOptions,
	});
	mainWindow.removeMenu();
	if (isDev) mainWindow.maximize();
	mainWindow.loadURL(
		isDev
			? 'http://localhost:5000'
			: `file://${path.join(__dirname, '../index.html')}`
	);

	// setup development tools
	if (isDev) {
		// eslint-disable-next-line global-require
		const electronDevtoolsInstaller = require('electron-devtools-installer');
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
		])
			.then(() => console.log('Devtools extensions installed successfully'))
			.catch((err: Error) =>
				console.error('Error installing devtools extensions\n', err)
			);
	}
	mainWindow.on('closed', () => (mainWindow = null));
	mainWindow.on('resize', () => {
		console.log(mainWindow?.getSize());
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (mainWindow === null) createWindow();
});
