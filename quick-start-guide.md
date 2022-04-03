# Electron Quick Start Guide

## 1. Create the directory
```
mkdir electron-app
cd electron-app
```

## 2. Initialize node application and fill in questionaire. Fill in entrypoint as `main.js`.

This initialization will create a `package.json` file.

The entrypoint of the Electron app is the file specified as `"main"` within `package.json`.

From docs: "This script controls the main process, which runs in a full Node.js environment and is responsible for controlling your app's lifecycle, displaying native interfaces, performing privileged operations, and managing renderer processes (more on that later)."

For entry point, manually type in `main.js` when the initializer wizard asks for consistent naming convention with the rest of this walkthough.

```
npm init
```

## 3. Install electron as development dependency
```
npm install --save-dev electron
```

## 4. Create the Main Process

Create a file `main.js` in root of the directory with the following content:
```
console.log('hello world!');
```

## 5. Add a start script to package.json
1. In the scripts section of package.json file, add `"start": "electron ."`
```
{
  "scripts": {
    "start": "electron ."
  }
}
```

2. Run `npm start` from the terminal. You should see a log `hello world!`. Let's add an actual application window.

## 6. Create a webpage
Electron displays HTML/CSS/JS just like a web browser.

Make a file `index.html` in the root directory with the following content:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Hello Electron!</title>
  </head>
  <body>
    <h1>Hello Electron!</h1>
    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>.
  </body>
</html>
```

## 7. Open the webpage
Electron will open an application window when certain functions are called within the `main` script. These functions are `app` and `BrowserWindow`.These are imported from the `electron` library.

`app` is the application process' object. BrowserWindow is a class that manages the application window.

In Electron, browser windows can only be created after the app module's ready event is fired. You can wait for this event by using the `app.whenReady()` API, and creating the browser only after the `whenReady()` Promise is resolved.

1. Change the contents of `main.js` to the following:
```javascript
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
	const window = new BrowserWindow({
		width: 800,
		height: 600
	});

	window.loadFile('index.html');
};

app.whenReady().then(() => {
	createWindow();
});
```

2. If the application is still running in the terminal, stop the process, `^C`, and restart it. By default, electron does not watch for changes and automatically reload.

## 8. Create A Preload Script
A preload script is run before the browser renderer renders, and has access to node variables from the `main` process. In contrast, once the window renders, the browser window will *not* have access to variables of the main process.

We will need to use the main process' `process` variables to fill in the spans in index.html that look like `<span id="node-version"></span>`. There is a span for node version, chrome version, and electron version.

1. Create a file `preload.js` in the root directory of the project with the following content. Note the use of `process.versions`. This object is not available in the rendered HTML, so must be used within a preload script:

```javascript
window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    let element = document.getElementById(`${dependency}-version`);
    element.innerText = process.versions[dependency];
  }
});
```

If you are interested in Electron's process model, why/how the main and BrowserWindow renderer processes are different, and more depth on preloading see the References at the end.

## 9. Attach preload script to the render process
`new BrowserWindow`, used within `main.js`, accepts a configuration object to specify the appearance and behavior of the window.

1. Alter the `new BrowserWindow` configuration object to look like the following:
```javascript
const window = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
});
```

2. You will also need to import in node's `path` library. Add the following to the top of `main.js`.
```javascript
const path = require('path');
```

3. Run `npm start` to see the application and see the `process` variables properly loaded into the application window.

## 10. Add Interactivity to the Application
Much like the usual browser environment, add `<script>` tags at the end of the `index.html` `<body>` tag.

1. Create a file, `clickHandler.js`, in the root directory with the following content:
```javascript
document.addEventListener('click', () => {
	alert('Hello, Electron!');
});
```

2. Add the following within the `<body>` element of `index.html`:
```
<script src="./clickHandler.js"></script>
```
3. Re-run `npm start`.

## 11. Window Lifecycle
The following boilerplate code will handle ending the application's process similar to the end user's native operating system. For this, the application will listen for events, and execute the required functions when the event is seen.

Node's `process.platform` is used to determine what operating system the end user is running the application on. The convention for Windows and Linux is to exit the application when all windows are closed. For MacOS, the usual application behavior is to keep the application running in the background, even if a user closes all windows. When the user re-clicks the application widget, the app opens a new window.

Add the following to the `app.whenReady().then(() => { ... })` callback within `main.js`.

```javascript
// For Windows and Linux, quit the app if all windows are closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

// For MacOS, open a window if the application icon is activated (e.g. clicked)
app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

Now the app should act as customary for the end user's operating system.

## 12. Distribute the Application
The Electron application will have to be "packaged" for distribute. This means compiling a binary file that can run on end users' computers. For this, use the Electron Forge npm library.

1. Install Electron Forge's command-line interface.
```
npm i -D @electron-forge/cli
```

2. Execute the interface's `import` command.
```
npx electron-forge import
```

3. Create the distributable.
One of the tasks of the `import` command is to add a `make` script to the `package.json` in the root directory. Run the command:
```
npm run make
```

This creates a directory, `out`, in the root directory. Within this directory is the application you can run by double clicking the icon.

For me, this application was located at `.\out\electron-app-win32-x64\electron-app`. Electron's documentation lists `out/electron-app-darwin-x64/electron-app.app/Contents/MacOS/electron-app` as the location for a MacOS user.


## 13. Test locally
Open up the distributable on your local machine. If all went well, you have a new desktop application that lists the app's dependencies and says Hello! when the user clicks.

You may notice the application only built for the operating system you are currently using. This is a limitation of operating system software.

See Tips for building for non-local operating systems using Github Actions. Also see the document on `makers` in the References for configuring Electron Forge.

Cheers, and get to amplifying this rather rudimentary Electron app.

## 14. Build multi-platform
Github Actions is a free and simple tool for exectuing workflow tasks such as running test suites and compiling distibutables. These tasks are run on Github's remote servers and can be configured to use an operating system of the developer's choice.

The configuration for these "jobs" is defined in a file `.github/workflows/build.yml`.

1. Initialize a git repository on github.com with the application code.
```
git init
```

2. Create a file `.gitignore` in the root directory with the following content:
```
node_modules/
```

3. Push to remote repository
```
git add .
git commit -m 'Init click handling Electron app'
git remote add origin 
```


---

## Tips
* Remember, the Electron Browser window is Chromium browser based. It has many of the same functionality as a typical web browser. All the JavaScript tricks you've picked up for web development port over to Electron development.
* Within the Electron App, press `ctrl+shift+i` to open developer tools, just like a in the broswer!
* To open dev tools programmatically, use the `mainWindow.webContents.openDevTools()` function within `main.js` (e.g. within the `createWindow` function.)
* Add `css` and `js` libs like jQuery and lodash when you are ready for more functionality.
* If you own computers with different operating systems, use Github or a flash drive to copy the application code to the other operating system, and create an operating system specific build that way.
* See a future article for using Github Actions to build for multiple operating systems simply when the code is pushed to a Github server.

---

## Resources

Electron docs: https://www.electronjs.org/docs/latest/tutorial/quick-start

Process Model: https://www.electronjs.org/docs/latest/tutorial/process-model

Electron Forge Configuration and Makers: https://www.electronforge.io/config/makers

Build and Publish a Multi-Platform Electron App on Github: https://dev.to/erikhofer/build-and-publish-a-multi-platform-electron-app-on-github-3lnd

© Popular Demand