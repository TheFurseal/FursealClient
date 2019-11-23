// Modules to control application life and create native browser window
const electron = require('electron')
const {app, BrowserWindow,dialog,Tray,Menu} = electron
const path = require('path')
const ipcMain = require('electron').ipcMain
const process = require('process')
const Furseal = require('./Furseal/index.js')
const { autoUpdater } = require("electron-updater")
const fs = require('fs')

var gotTheLock = app.requestSingleInstanceLock()
if(!gotTheLock){
  app.exit()
}

var date = new Date()
if(app.isPackaged){
  var logPath = app.getPath('appData')+'/CoTNetwork/logs'
  if(!fs.existsSync(logPath)){
    fs.mkdirSync(logPath,{recursive:true})
  }

  var access = fs.createWriteStream(logPath + '/Furseal'+date.valueOf()+'.log', { flags: 'a' })
  process.stdout.write = process.stderr.write  = access.write.bind(access)
}else{
}

process.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
var updateWindow
let tray = null


var w =1000;
var h = 500;
if(process.platform == 'win32'){
	h=550;
}

function initCore(){
  if(app.nodeCore == null){
    app.nodeCore = new Furseal(app.getPath('appData')+'/CoTNetwork')
    app.nodeCore.init()
  }
}

function createWindow () {

  if (!gotTheLock) {
    console.log('Fureseal client already runing')
    app.exit()
  }
  // Create the browser window.
  var frame = true
  if(process.platform == 'win32'){
    frame = false
  }
  mainWindow = new BrowserWindow({
    width: w,
    height: h,
    frame:frame,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'static/images/icon.png')
   
  })

  mainWindow.setFullScreenable(false);
  //mainWindow.maximizable(false)
  mainWindow.removeMenu();
  //mainWindow.resizable(false)
  mainWindow.setResizable(false);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.setTitle('Furseal v'+app.getVersion())

  // Open the DevTools.
  if(process.env.COT_DEV == true){
    mainWindow.webContents.openDevTools()
  }


  mainWindow.on('close',(event) => {

  })
}

autoUpdater.on('update-not-available',() => {
  console.log('No available update detected, start core')
  initCore()
  createWindow()
})

autoUpdater.on('error', err => {
  console.log(err)
  setImmediate(() => {
    initCore()
    createWindow()
  }) 
})
autoUpdater.on('update-available',(message) => {
  updateWindow = new BrowserWindow({
    width: 600,
    height: 200,
    titleBarStyle: 'hidden',
    frame:false,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'updatePreload.js')
    },
    icon: path.join(__dirname, 'static/images/icon.png')
  })
  updateWindow.removeMenu()
  updateWindow.loadFile('update.html')
})
autoUpdater.on('download-progress',(msg) => {
  updateWindow.webContents.send('updateDownloadProgress',msg)
})

autoUpdater.on('update-downloaded',(event,relNotes) => {
  dialog.showMessageBox({
    title:"Install updates",
    message:"Updates downloaded, application will  quit and install update ..."
  },() => {
    setImmediate(() => {
      updateWindow.destroy()
      autoUpdater.quitAndInstall(true,true)
    })
  })
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  try{
    autoUpdater.checkForUpdates()
  }catch(e){
     console.error(e)
  }
  if(process.platform == 'win32'){
    tray = new Tray(path.join(__dirname, 'static/images/icon.png'))
    const contexMenu = Menu.buildFromTemplate([
      {
        label:"ShowApp",click: () => {
        createWindow()
      }},
      {
        label:"Quit",click: () => {
          app.quit()
        }
      }
    ])
    tray.setToolTip('Furseal')
    tray.setContextMenu(contexMenu)
    tray.on('click',() => {
      createWindow()
    })
  }


  
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  mainWindow = null
})

app.on('will-quit',(event) => {
  event.preventDefault()
  if(app.nodeCore != null){
    async function shutDown(){
      await app.nodeCore.shutdown()
      app.nodeCore = null
      event.returnValue = true
      console.log('App quit!')
      app.exit(0)
    }
    shutDown()
  }else{
    event.returnValue = true
    console.log('App quit 2!')
    app.exit(0)
  }
  
})

app.on('activate', (event, hasVisibleWindows) => {
  console.log('activate !')
  console.log(process.platform)
  if(process.platform == 'darwin'){
    
    if(!hasVisibleWindows){
      if(mainWindow == null){
        createWindow()
      }else{
        mainWindow.restore()
      }
    }else{
      if(mainWindow != null){
        mainWindow.restore()
      }
     
    }
  }
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



