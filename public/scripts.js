const startButton = document.getElementById("startButton");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const finishQuestioningButton = document.getElementById("finishQuestioningButton");

const sellerQuestionsListContainer = document.getElementById("sellerQuestionsListContainer");
const sellerQuestionsList = document.getElementById("sellerQuestionsList");

const userQuestionText = document.getElementById("userQuestion");

// UI elements for the user input
const userButtonInputUI = document.getElementById("userButtonInputUI");
const userNumericalInputUI = document.getElementById("userNumericalInputUI");
const usertextInputUI = document.getElementById("userTextInputUI");

// Actual user inputs
const numericalInput = document.getElementById("numericalInput");
const textInput = document.getElementById("textInput");

// 3 states
const startState = document.getElementById("startState");
const questioningState = document.getElementById("questioningState");
const endQuestioningState = document.getElementById("endQuestioningState");

const loadingText = "Thinking...";
const loadingPlaceholder = document.createElement("li");
loadingPlaceholder.textContent = loadingText;

let chat_history = [];

let photoCompletenessValueE = document.getElementById("photoCompletenessValueE");
let photoAuthenticityValueE = document.getElementById("photoAuthenticityValueE");
let descriptionDetailValueE = document.getElementById("descriptionDetailValueE");
let conditionClarityValueE = document.getElementById("conditionClarityValueE");
let descriptionReliabilityValueE = document.getElementById("descriptionReliabilityValueE");
let priceRealismValueE = document.getElementById("priceRealismValueE");
let priceJustificationValueE = document.getElementById("priceJustificationValueE");
let sellerTransparencyValueE = document.getElementById("sellerTransparencyValueE");
let sellerBehaviourValueE = document.getElementById("sellerBehaviourValueE");
let scamRiskValueE = document.getElementById("scamRiskValueE");

let photoCompletenessValue = document.getElementById("photoCompletenessValue");
let photoAuthenticityValue = document.getElementById("photoAuthenticityValue");
let descriptionDetailValue = document.getElementById("descriptionDetailValue");
let conditionClarityValue = document.getElementById("conditionClarityValue");
let descriptionReliabilityValue = document.getElementById("descriptionReliabilityValue");
let priceRealismValue = document.getElementById("priceRealismValue");
let priceJustificationValue = document.getElementById("priceJustificationValue");
let sellerTransparencyValue = document.getElementById("sellerTransparencyValue");
let sellerBehaviourValue = document.getElementById("sellerBehaviourValue");
let scamRiskValue = document.getElementById("scamRiskValue");
const metrics = [
  photoCompletenessValue,
  photoAuthenticityValue,
  descriptionDetailValue,
  conditionClarityValue,
  descriptionReliabilityValue,
  priceRealismValue,
  priceJustificationValue,
  sellerTransparencyValue,
  sellerBehaviourValue,
  scamRiskValue
];

const metricsE = [
  photoCompletenessValueE,
  photoAuthenticityValueE,
  descriptionDetailValueE,
  conditionClarityValueE,
  descriptionReliabilityValueE,
  priceRealismValueE,
  priceJustificationValueE,
  sellerTransparencyValueE,
  sellerBehaviourValueE,
  scamRiskValueE
];

const scores = [
  "Unknown",
  "Unknown",
  "Unknown",
  "Unknown",
  "Unknown",
  "Unknown",
  "Unknown",
  "Unknown",
  "Unknown",
  "Unknown"
];

let overallVerdictSummary = document.getElementById("overallVerdictSummary");
let strengthsSummary = document.getElementById("strengthsSummary");
let concernsSummary = document.getElementById("concernsSummary");
let recommendationSummary = document.getElementById("recommendationSummary");

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
  hide(startState);

  show(questioningState)
  changeToLoadingText(userQuestionText);
  show(userQuestionText);

  const generatedText = await handlePrompt("", "start");
  displayNextUserQuestion(generatedText)
}

function displayNextUserQuestion(generatedText) {
  const [generatedUserQuestion, inputType] = generatedText.split("|").map(s => s.trim());
  displayUserQuestionText(generatedUserQuestion);
  displayUserInput(inputType);
}

function updateScoresUI(generatedText) {
  scores = generatedText.split("|").map(s => s.trim());

  for (i=0; i<metrics.length; i++) {
    metrics[i].textContent = scores[i]
  }
}

function changeToLoadingText(textContainer) {
  textContainer.textContent = loadingText;
}

async function handleUserSubmit(userInput) {
  hideInputUI();

  metrics.forEach((metric) => changeToLoadingText(metric))
  let generatedText = await handlePrompt(userInput, "update rating");
  updateScoresUI(generatedText);

  changeToLoadingText(userQuestionText)
  generatedText = await handlePrompt("", "get next user question");
  displayNextUserQuestion(generatedText);
}

function displayUserQuestionText(generatedUserQuestion) {
  userQuestionText.textContent = generatedUserQuestion;
}

function displayUserInput(inputType) {
  if (inputType == "yesNoInput") {
    show(userButtonInputUI);
  } else if (inputType == "numInput") {
    show(userNumericalInputUI);
    numericalInput.focus()
  } else if (inputType == "textInput") {
    show(usertextInputUI);
    textInput.focus()
  }
}

async function handlePrompt(prompt, promptType) {
  // Takes a prompt string, passes it to the AI chatbot, returns what the AI chatbot generated.

  const response = await fetch("https://shopping-assistant.marlonwen10.workers.dev/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt, promptType: promptType, chat_history: chat_history })
  });

  const data = await response.json();
  const generatedText = data.response;

  console.log(generatedText);

  chat_history = data.chat_history;
  chat_history.push({ role: "assistant", content: generatedText });

  console.log(chat_history);

  return generatedText;
}

async function handleTextInputEvent(event) {
  if (event.key === "Enter") {
    handleUserSubmit(textInput.value);
    textInput.value = "";
  }
}

async function handleNumericInputEvent(event) {
  if (event.key === "Enter") {
    handleUserSubmit(numericalInput.value);
    numericalInput.value = "";
  }
}

async function handleYesButton() {
  handleUserSubmit("Yes");
}

async function handleNoButton() {
  handleUserSubmit("No");
}

async function handleNoButton() {
  handleUserSubmit("No");
}

function giveScoresToEndScorePanel() {
  for (i=0; i<metrics.length; i++) {
    metricsE[i].textContent = scores[i]
  }
}

async function handleFinishQuestioningButton() {
  hide(questioningState)

  sellerQuestionsList.appendChild(loadingPlaceholder)
  giveScoresToEndScorePanel()
  show(endQuestioningState);
  const generatedText = await handlePrompt("", "finish questioning");
  sellerQuestionsList.removeChild(loadingPlaceholder)
  parseGeneratedTextToHTMLList(generatedText, sellerQuestionsList)

  generateSummary()
}

function parseGeneratedTextToHTMLList(generatedText, HTMLList) {
  const list = generatedText.split("|").map(s => s.trim());
  list.forEach(question => {
    const listItem = document.createElement("li");
    listItem.textContent = question;
    HTMLList.appendChild(listItem);
  });
}

async function generateSummary() {
  changeToLoadingText(overallVerdictSummary)
  let generatedText = await handlePrompt("", "get overallVerdictSummary");
  overallVerdictSummary.textContent = generatedText

  strengthsSummary.appendChild(loadingPlaceholder)
  generatedText = await handlePrompt("", "get strengthsSummary")
  strengthsSummary.removeChild(loadingPlaceholder);
  parseGeneratedTextToHTMLList(generatedText, strengthsSummary)

  concernsSummary.appendChild(loadingPlaceholder)
  generatedText = await handlePrompt("", "get concernsSummary");
  concernsSummary.removeChild(loadingPlaceholder)
  parseGeneratedTextToHTMLList(generatedText, concernsSummary)

  changeToLoadingText(recommendationSummary)
  generatedText = await handlePrompt("", "get recommendationSummary");
  recommendationSummary.textContent = generatedText
}

startButton.addEventListener("click", handleStartButton);
yesButton.addEventListener("click", handleYesButton);
noButton.addEventListener("click", handleNoButton);
finishQuestioningButton.addEventListener("click", handleFinishQuestioningButton);

numericalInput.addEventListener("keydown", handleNumericInputEvent);
textInput.addEventListener("keydown", handleTextInputEvent);