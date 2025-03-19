const { app, BrowserWindow, ipcMain } = require("electron");
const dgram = require("dgram");
const dayjs = require("dayjs");

if (require("electron-squirrel-startup")) app.quit();

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true, // Security
      nodeIntegration: false, // Security
    },
  });

  mainWindow.loadFile("index.html");
});

let currentSocket;

ipcMain.on("start-listening", (event, port, isListening) => {
  if (!isListening && !!currentSocket) {
    currentSocket.close(() => {
      displayMessage(`Previous listeners closed.`);
      currentSocket = null;
    });
    return;
  }

  const socket = dgram.createSocket("udp4");
  currentSocket = socket;
  socket.on("message", (msg, rinfo) => {
    const minerMessage = msg.toString();
    displayMessage(`Received message from ${rinfo.address}:${rinfo.port}`);
    displayMessage(msg);
  });

  socket.bind(port, () => {
    displayMessage(`Listening on port ${port} (UDP)`);
  });
});

function displayMessage(message) {
  mainWindow.webContents.send(
    "message-received",
    `${dayjs().format("MM/DD HH:mm:ss")}: ${message}`
  );
}
