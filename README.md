# election-app

Electron application walkthrough and boiler plate.

## How to Use

1. Follow the walkthrough found in [quick-start-guide.md] if you are interested in building an Electron application.

3. Clone the [boilerplate] and get to hacking if you are ready to get started. See [Development] for local development setup defaults.

2. Download and investigate a sample application if you are interested in what can be built with Electron.

## Follow the walkthrough

1. Clone the repository.
```
$ git clone https://github.com/popdemtech/electron-app.git my-electron-app-repo-name
$ cd my-electron-app-repo-name
```

2. Navigate to the walkthrough branch.
```
$ git fetch origin walkthrough
$ git checkout -b walkthrough
$ git pull origin walkthrough
```

These steps should land you on a branch with minimal files and `walkthrough.md`. Open `walkthrough.md` in a text editor and follow along by building the example application in the same directory.

## Development

```
$ git clone https://github.com/popdemtech/electron-app.git my-electron-app-repo-name
$ cd my-electron-app-repo-name
$ npm install
$ npm run start
```

The above commands clone the application boilerplate, change directory to the cloned application, installs application dependencies, and starts a local application respectively.

Alter index.html, main.js, preload.js to suite your needs. And, importantly, add new files and libraries to supersize the functionality! Have fun with it.

See the Electron documentation for implementation and walkthroughs and [examples](https://www.electronjs.org/docs/latest/tutorial/examples) to spark your inspiration.

See also [awesome-electron](https://github.com/sindresorhus/awesome-electron#boilerplates).

## Example apps

[Box Jump](https://github.com/popdemtech/box-jump): Collision detection game with canvas and electron-app
