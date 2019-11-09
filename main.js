// Modules to control application life and create native browser window
const electron = require('electron')
const {app, BrowserWindow,dialog} = electron
const path = require('path')
const ipcMain = require('electron').ipcMain
const process = require('process')
const Furseal = require('./Furseal/index.js')
const { autoUpdater } = require("electron-updater")

const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
var updateWindow


var w =1000;
var h = 500;
if(process.platform == 'win32'){
	h=530;
}


function initCore(){
  app.nodeCore = new Furseal(app.getPath('appData')+'/CoTNetwork')
  app.nodeCore.init()
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
  mainWindow.setTitle('Furseal v'+app.getVersion())

  // Open the DevTools.
  if(process.env.COT_DEV == true){
    mainWindow.webContents.openDevTools()
  }


  mainWindow.on('close',(event) => {
    event.preventDefault()
    const options = {
      type: 'question',
      buttons: ['退出','取消','最小化到托盘'],
      defaultId: 2,
      title: '操作确认',
      message: '退出Fursel将导致所有任务停止计算，正在计算的任务也将不会返回，确定要退出?'
    }
    dialog.showMessageBox(null,
     options,(ret) => {
      if(ret == 0){
       
        setTimeout(() => {
          mainWindow.destroy()
        }, 500);
        event.returnValue = true
      }else if(ret == 2){
      
        mainWindow.minimize()
        event.returnValue = false
      }else{
        
      }
    })
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
    icon: path.join(__dirname, 'images/ic_launcher_round.png')
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
      if(fs.existsSync(app.getPath('appData')+'/CoTNetwork/run.lock')){
        fs.unlinkSync(app.getPath('appData')+'/CoTNetwork/run.lock')
      }
      autoUpdater.quitAndInstall(true,true)
    })
  })
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if(fs.existsSync(app.getPath('appData')+'/CoTNetwork/run.lock')){
    var tmp = fs.readFileSync(app.getPath('appData')+'/CoTNetwork/run.lock')
    var date = new Date()
    if(date.valueOf() - parseInt(tmp) < 70000){
      app.quit()
    }else{
      setInterval(() => {
        var date = new Date()
        fs.writeFileSync(app.getPath('appData')+'/CoTNetwork/run.lock',date.valueOf())
      }, 5000);
    }
  }else{
    setInterval(() => {
      var date = new Date()
      fs.writeFileSync(app.getPath('appData')+'/CoTNetwork/run.lock',date.valueOf())
    }, 5000);
    
  }
  try{
    autoUpdater.checkForUpdates()
  }catch(e){
    console.error(e)
  }
  
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if(fs.existsSync(app.getPath('appData')+'/CoTNetwork/run.lock')){
    fs.unlinkSync(app.getPath('appData')+'/CoTNetwork/run.lock')
  }
  if(app.nodeCore != null){
    async function shutDown(){
      await app.nodeCore.shutdown()
      app.quit()
    }
    shutDown()
  }else{
    app.quit()
  }
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



