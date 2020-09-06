import { emit } from 'eiphop';

export const quitApp = () => {
	console.warn('Quitting application');
	emit('quitApp').catch(console.error);
};

export const restartApp = () => {
	console.warn('Restarting application');
	emit('restartApp').catch(console.error);
};
