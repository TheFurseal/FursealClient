// Modules to control application life and create native browser window
const {app, BrowserWindow,dialog} = require('electron')
const path = require('path')
const ipcMain = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var w =1000;
var h = 500;
if(process.platform == 'win32'){
	h=530;
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: w,
    height: h,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'images/ic_launcher_round.png')
   
  })

  mainWindow.setFullScreenable(false);
  mainWindow.setMaximizable(false);
  mainWindow.removeMenu();
  // mainWindow.setResizable(false);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  console.log('all close on main')
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') app.quit()
  // var lockPath = app.getPath('appData')+'/CoTNetwork/fileStorage/repo.lock'
  // Tools.removeRepoLock(lockPath)
  app.quit();
})


app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//ipc singnal

ipcMain.on('select-file', (event, arg) => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (files) {
    var ret = {}
    ret.value = files
    ret.type = arg
    if (files) event.sender.send('selected-file', ret)
  })
  
});



