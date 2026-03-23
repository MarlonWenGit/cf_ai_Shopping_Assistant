const startButton = document.getElementById("startButton");

const userQuestionText = document.getElementById("userQuestion");

// UI elements for the user input
const userButtonInputUI = document.getElementById("userButtonInputUI");
const userNumericalInputUI = document.getElementById("userNumericalInputUI");
const usertextInputUI = document.getElementById("userTextInputUI");

// Actual user inputs
const numericalInput = document.getElementById("numericalInput");
const textInput = document.getElementById("textInput");

let chat_history = [];
let step = 1;

let completenessValue = document.getElementById("completenessValue");
let credibilityValue = document.getElementById("credibilityValue");
let scamValue = document.getElementById("scamValue");

function updateStep() {
  if (step == 1) {
    step = 2;
  } else if (step == 2) {
    step = 1;
  }
}

function hide(object) {
  object.classList.add("hidden");
}

function show(object) {
  object.classList.remove("hidden");
}

function hideInputUI() {
  hide(userButtonInputUI);
  hide(userNumericalInputUI);
  hide(usertextInputUI);
}

async function handleStartButton() {
  hide(startButton);

  const generatedText = await handlePrompt("", "start");
  displayNextUserQuestion(generatedText)
}

function displayNextUserQuestion(generatedText) {
  const [generatedUserQuestion, inputType] = generatedText.split("|").map(s => s.trim());
  displayUserQuestionText(generatedUserQuestion);
  displayUserInput(inputType);
}

function updateScoresUI(generatedText) {
  const [listingCompleteness, sellerCredibility, riskOfScam] = generatedText.split("|").map(s => s.trim());
  completenessValue.textContent = listingCompleteness;
  credibilityValue.textContent = sellerCredibility;
  scamValue.textContent = riskOfScam;
}

async function handleUserSubmit(userInput) {
  hideInputUI();
  let generatedText = await handlePrompt(userInput, "update rating");
  updateScoresUI(generatedText);

  generatedText = await handlePrompt("", "get next user question");
  displayNextUserQuestion(generatedText);
}

function displayUserQuestionText(generatedUserQuestion) {
  userQuestionText.textContent = generatedUserQuestion;
  show(userQuestionText);
}

function displayUserInput(inputType) {
  if (inputType == "yesNoInput") {
    show(userButtonInputUI);
  } else if (inputType == "numInput") {
    show(userNumericalInputUI);
  } else if (inputType == "textInput") {
    show(usertextInputUI);
  }
}

async function handlePrompt(prompt, promptType) {
  // Takes a prompt string, passes it to the AI chatbot, returns what the AI chatbot generated.

  const response = await fetch("http://127.0.0.1:8787/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt, promptType: promptType, step: step, chat_history: chat_history })
  });

  const data = await response.json();
  const generatedText = data.response

  console.log(generatedText);

  chat_history = data.chat_history
  chat_history.push({ role: "assistant", content: generatedText })

  console.log(chat_history);

  return generatedText
}

async function handleTextInputEvent(event) {
  if (event.key === "Enter") {
    handleUserSubmit(textInput.value);
    textInput.value = ""
  }
}

startButton.addEventListener("click", handleStartButton);
textInput.addEventListener("keydown", handleTextInputEvent);