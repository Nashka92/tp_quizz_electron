const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

let questionsData = []
let usedQuestionsIndices = new Set()

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()

  fs.readFile('questions.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON:', err)
      return
    }
    questionsData = JSON.parse(data).questions
    mainWindow.webContents.on('did-finish-load', () => {
      sendNewQuestion(mainWindow)
    })
  })
}

function sendNewQuestion(window) {
  if (usedQuestionsIndices.size === questionsData.length) {
    usedQuestionsIndices.clear()
  }

  let randomIndex
  do {
    randomIndex = Math.floor(Math.random() * questionsData.length)
  } while (usedQuestionsIndices.has(randomIndex))

  usedQuestionsIndices.add(randomIndex)
  const question = questionsData[randomIndex]
  window.webContents.send('new-question', question)
}

ipcMain.on('request-new-question', (event) => {
  sendNewQuestion(BrowserWindow.fromWebContents(event.sender))
})

ipcMain.on('quit-app', () => {
  app.quit()
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})