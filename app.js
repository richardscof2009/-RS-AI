// @ts-nocheck
const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const welcome = document.getElementById("welcome");
const historyBox = document.getElementById("history");

let chats = JSON.parse(localStorage.getItem("rs_ai_chats") || "[]");
let currentChat = [];

function saveChats() {
  localStorage.setItem("rs_ai_chats", JSON.stringify(chats));
}

function displayMessage(text, sender) {
  const message = document.createElement("div");
  message.className = "message " +
    (sender === "user" ? "user-message" : "ai-message");
  message.textContent = text;
  chatArea.appendChild(message);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function sendMessage() {
  const text = messageInput.value.trim();

  if (!text) return;

  if (welcome) welcome.style.display = "none";

  displayMessage(text, "user");
  currentChat.push({ sender: "user", text });

  messageInput.value = "";

  const reply = "Murakoze gukoresha RS AI! Interface irakora. AI nyayo tuzoyihuza na API biciye kuri backend itekanye mu ntambwe ikurikira.";

  setTimeout(() => {
    displayMessage(reply, "ai");
    currentChat.push({ sender: "ai", text: reply });

    chats.push({
      title: text.slice(0, 35),
      messages: [...currentChat]
    });

    saveChats();
    renderHistory();
  }, 400);
}

function suggest(text) {
  messageInput.value = text;
  sendMessage();
}

function newChat() {
  currentChat = [];
  chatArea.innerHTML = "";

  const welcomeBox = document.createElement("div");
  welcomeBox.className = "welcome";
  welcomeBox.id = "welcome";

  welcomeBox.innerHTML = `
    <div class="big-logo">RS</div>
    <h1>Welcome to RS AI</h1>
    <p>Your intelligent assistant for everything.</p>
  `;

  chatArea.appendChild(welcomeBox);
}

function renderHistory() {
  historyBox.innerHTML = "";

  chats.forEach((chat, index) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.textContent = chat.title;
    item.onclick = () => openChat(index);
    historyBox.appendChild(item);
  });
}

function openChat(index) {
  currentChat = [...chats[index].messages];
  chatArea.innerHTML = "";

  currentChat.forEach(message => {
    displayMessage(message.text, message.sender);
  });
}

function toggleSettings() {
  document.getElementById("settings").classList.toggle("open");
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");

  if (window.innerWidth <= 700) {
    sidebar.style.display =
      sidebar.style.display === "block" ? "none" : "block";

    sidebar.style.position = "absolute";
    sidebar.style.zIndex = "20";
    sidebar.style.height = "100%";
  }
}

const themeSelect = document.getElementById("themeSelect");
const modeSelect = document.getElementById("modeSelect");

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("rs_ai_theme", theme);
}

function applyMode(mode) {
  document.body.classList.toggle("light", mode === "light");
  localStorage.setItem("rs_ai_mode", mode);
}

themeSelect.addEventListener("change", () => {
  applyTheme(themeSelect.value);
});

modeSelect.addEventListener("change", () => {
  applyMode(modeSelect.value);
});

messageInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

const savedTheme = localStorage.getItem("rs_ai_theme") || "cosmic";
const savedMode = localStorage.getItem("rs_ai_mode") || "dark";

themeSelect.value = savedTheme;
modeSelect.value = savedMode;

applyTheme(savedTheme);
applyMode(savedMode);
renderHistory();