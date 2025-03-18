document.getElementById("start-listening").addEventListener("click", () => {
  const port = document.getElementById("port").value;

  if (document.getElementById("is-listening").value === "false") {
    document.getElementById("is-listening").value = "true";
    document.getElementById("start-listening").textContent = "Stop Listening";
    document.getElementById("start-listening").className = "mt-3 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2";
    document.getElementById("port").disabled = true;
  } else {
    document.getElementById("is-listening").value = "false";
    document.getElementById("start-listening").textContent = "Start Listening";
    document.getElementById("start-listening").className = "mt-3 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    document.getElementById("port").disabled = false;
  }
  const isListening = document.getElementById("is-listening").value

  window.earsApi.startListening(port, !isListening);
});

window.earsApi.onMessageReceived((message) => {
  const display = document.getElementById("message-display");
  display.textContent = `Received: ${message}`;
});
