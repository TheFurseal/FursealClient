// Modules to control application life and create native browser window
const electron = require('electron')
const {app, BrowserWindow,dialog} = electron
const path = require('path')
const ipcMain = require('electron').ipcMain
const process = require('process')
const Furseal = require('./Furseal/index.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var w =1000;
var h = 500;
if(process.platform == 'win32'){
	h=530;
}
app.nodeCore = new Furseal(app.getPath('appData')+'/CoTNetwork')
app.nodeCore.init()

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
    let bounds = electron.screen.getPrimaryDisplay().bounds;
    let x = bounds.x + (bounds.width  / 2)-50;
    let y = bounds.y + (bounds.height / 2)-50;
    var baseWin = new BrowserWindow({
      width: 100,
      height: 100, 
      x: x,
      y: y,
      alwaysOnTop:true,
      transparent:true
    })
    dialog.showMessageBox(baseWin,
     options,(ret) => {
      if(ret == 0){
        console.log('desdroy core')
        baseWin.close()
        setTimeout(() => {
          mainWindow.destroy()
        }, 500);
        event.returnValue = true
      }else if(ret == 2){
        baseWin.close()
        mainWindow.minimize()
        event.returnValue = false
      }
    })
  })

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
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



