import { EipHop } from 'eiphop';

const quitApp = (app: Electron.App): EipHop.Action<void, void> => {
	return (req, res) => {
		try {
			app.quit();
		} catch (error) {
			res.error(error);
		}
		res.send();
	};
};

const restartApp = (app: Electron.App): EipHop.Action<void, void> => {
	return (req, res) => {
		try {
			app.relaunch();
			app.quit();
		} catch (error) {
			res.error(error);
		}
	};
};

export default {
	quitApp,
	restartApp,
};
