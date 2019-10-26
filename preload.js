// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   for (const versionType of ['chrome', 'electron', 'node']) {
//     document.getElementById(`${versionType}-version`).innerText = process.versions[versionType]
//   }
// })

window.fs = require('fs');
const Tools = require('./Furseal/src/common/tools.js')
var IPCManager = require('./Furseal/src/common/IPCManager.js')

window.ipcManager = new IPCManager();
window.ipcManager.createClient({})

const remote = require('electron').remote;
const app = remote.app;

window.appPath = app.getPath('appData')+'/CoTNetwork';
window.tempPath = app.getPath('temp')+'/CoTNetwork';
const core = require('./Furseal/index.js');
window.nodeCore = new core(window.appPath)
window.nodeCore.init()

remote.app.on('before-quit',() => {
  console.log('befor quit')
  window.nodeCore.p2pNode.shutdown()
  console.log('shutdown')
})

window.ipcRender = require('electron').ipcRenderer;
window.code = Tools.base58;

const Buffer = require('buffer');
window.buffer  = Buffer.Buffer;

const _setImmediate = setImmediate
const _clearImmediate = clearImmediate
process.once('loaded', () => {
  global.setImmediate = _setImmediate
  global.clearImmediate = _clearImmediate
})




