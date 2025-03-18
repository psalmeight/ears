const { app, BrowserWindow, ipcMain } = require("electron");
const dgram = require("dgram");

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
  console.log("Starting to listen...");

  if (!isListening && !!currentSocket) {
    console.log("Closing previous socket...");
    currentSocket.close(() => {
      console.log("Previous socket closed.");
      currentSocket = null;
    });
    return;
  }

  const socket = dgram.createSocket("udp4");
  currentSocket = socket;
  socket.on("message", (msg, rinfo) => {
    const minerMessage = msg.toString();
    mainWindow.webContents.send(
      "message-received",
      `Received message: ${minerMessage} from ${rinfo.address}:${rinfo.port}`
    );
  });

  socket.bind(port, () => {
    console.log(`Listening on UDP port ${port}`);
  });
});
