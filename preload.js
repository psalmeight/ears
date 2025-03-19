const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("cmListenerApi", {
  startListening: (port, isListening) => ipcRenderer.send("start-listening", port, isListening),
  onMessageReceived: (callback) =>
    ipcRenderer.on("message-received", (event, message) => callback(message)),
});
