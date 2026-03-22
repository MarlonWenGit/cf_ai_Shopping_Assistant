const startButton = document.getElementById("startButton");

function handleStartButton() {
  startButton.classList.add("hidden");
}

startButton.addEventListener("click", handleStartButton);