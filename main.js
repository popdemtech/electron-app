const { app, BrowserWindow } = require('electron');
const path = require('path');

const createWindow = () => {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	window.loadFile('index.html');
};

app.whenReady().then(() => {
	createWindow();

	// For Windows and Linux, quit the app if all windows are closed
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') app.quit();
	});

	// For MacOS, open a window if the application icon is activated (e.g. clicked)
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});