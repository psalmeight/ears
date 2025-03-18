const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("earsApi", {
  startListening: (port, isListening) => ipcRenderer.send("start-listening", port, isListening),
  onMessageReceived: (callback) =>
    ipcRenderer.on("message-received", (event, message) => callback(message)),
});
