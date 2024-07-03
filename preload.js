const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  onNewQuestion: (callback) => ipcRenderer.on('new-question', (event, question) => callback(question)),
  requestNewQuestion: () => ipcRenderer.send('request-new-question'),
  quitApp: () => ipcRenderer.send('quit-app')
})