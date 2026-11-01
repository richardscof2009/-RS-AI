// @ts-nocheck

// ============================================
// RS AI PREMIUM V3
// RS TECHNOLOGIES — 2026
// ============================================

// STORAGE
const STORAGE_KEY = "rs_ai_v3_chats";
const THEME_KEY = "rs_ai_v3_theme";
const MODE_KEY = "rs_ai_v3_mode";

// ELEMENTS
const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const welcome = document.getElementById("welcome");
const historyElement = document.getElementById("history");
const sidebar = document.getElementById("sidebar");
const settings = document.getElementById("settings");
const themeSelect = document.getElementById("themeSelect");
const modeSelect = document.getElementById("modeSelect");

// STATE
let chats = loadChats();
let currentChatId = null;

// ============================================
// STORAGE FUNCTIONS
// ============================================

function loadChats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveChats() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Could not save chat history:", error);
  }
}

function createId() {
  return Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8);
}

// ============================================
// CHAT FUNCTIONS
// ============================================

function newChat() {
  currentChatId = null;
  chatArea.innerHTML = "";
  chatArea.appendChild(welcome);
  welcome.style.display = "block";

  messageInput.value = "";
  messageInput.style.height = "auto";

  renderHistory();

  if (window.innerWidth <= 700) {
    sidebar.classList.remove("open");
  }

  messageInput.focus();
}

function getCurrentChat() {
  return chats.find(chat => chat.id === currentChatId);
}

function createChat(firstMessage) {
  const chat = {
    id: createId(),
    title: firstMessage.slice(0, 35) || "New conversation",
    messages: [],
    createdAt: Date.now()
  };

  chats.unshift(chat);
  currentChatId = chat.id;

  saveChats();
  renderHistory();

  return chat;
}

function displayMessage(text, sender) {
  if (welcome.parentNode) {
    welcome.style.display = "none";
  }

  const message = document.createElement("div");
  message.className =
    sender === "user" ? "message user-message" : "message ai-message";

  // textContent protects the chat from HTML injection.
  message.textContent = text;

  chatArea.appendChild(message);
  chatArea.scrollTop = chatArea.scrollHeight;

  return message;
}

function addMessageToChat(text, sender) {
  const chat = getCurrentChat();

  if (!chat) return;

  chat.messages.push({
    text: text,
    sender: sender,
    time: Date.now()
  });

  saveChats();
}

// ============================================
// SEND MESSAGE
// ============================================

function sendMessage() {
  const text = messageInput.value.trim();

  if (!text) return;

  let chat = getCurrentChat();

  if (!chat) {
    chat = createChat(text);
  }

  displayMessage(text, "user");
  addMessageToChat(text, "user");

  messageInput.value = "";
  messageInput.style.height = "auto";

  // TEMPORARY RESPONSE
  // Connect a secure AI backend here in a future step.
  const reply =
    "Murakoze gukoresha RS AI!\n\n" +
    "Interface ya RS AI irakora neza. Ubu turiko turategura " +
    "guhuza AI nyayo biciye kuri backend itekanye.\n\n" +
    "RS Technologies — 2026";

  setTimeout(() => {
    displayMessage(reply, "ai");
    addMessageToChat(reply, "ai");
    renderHistory();
  }, 500);

  renderHistory();
}

function suggest(text) {
  messageInput.value = text;
  sendMessage();
}

// ============================================
// CHAT HISTORY
// ============================================

function renderHistory() {
  historyElement.innerHTML = "";

  chats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "history-item";

    if (chat.id === currentChatId) {
      item.style.background = "var(--surface)";
      item.style.color = "var(--text)";
    }

    item.textContent = chat.title;
    item.title = chat.title;

    item.addEventListener("click", () => {
      openChat(chat.id);
    });

    historyElement.appendChild(item);
  });
}

function openChat(id) {
  const chat = chats.find(item => item.id === id);

  if (!chat) return;

  currentChatId = id;

  chatArea.innerHTML = "";

  if (!chat.messages.length) {
    chatArea.appendChild(welcome);
    welcome.style.display = "block";
  } else {
    welcome.style.display = "none";

    chat.messages.forEach(message => {
      displayMessage(message.text, message.sender);
    });
  }

  renderHistory();

  if (window.innerWidth <= 700) {
    sidebar.classList.remove("open");
  }
}

// ============================================
// SIDEBAR
// ============================================

function toggleSidebar() {
  sidebar.classList.toggle("open");
}

// ============================================
// SETTINGS
// ============================================

function toggleSettings() {
  settings.classList.toggle("open");
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  if (themeSelect) {
    themeSelect.value = theme;
  }
}

function applyMode(mode) {
  document.body.classList.toggle("light", mode === "light");
  localStorage.setItem(MODE_KEY, mode);

  if (modeSelect) {
    modeSelect.value = mode;
  }
}

// ============================================
// SETTINGS EVENTS
// ============================================

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    applyTheme(themeSelect.value);
  });
}

if (modeSelect) {
  modeSelect.addEventListener("change", () => {
    applyMode(modeSelect.value);
  });
}

// ============================================
// MESSAGE INPUT
// ============================================

messageInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height =
    Math.min(messageInput.scrollHeight, 130) + "px";
});

// ============================================
// INITIALIZATION
// ============================================

function initializeRS() {
  const savedTheme =
    localStorage.getItem(THEME_KEY) || "cosmic";

  const savedMode =
    localStorage.getItem(MODE_KEY) || "dark";

  applyTheme(savedTheme);
  applyMode(savedMode);

  renderHistory();

  // Restore the latest conversation if one exists.
  if (chats.length > 0) {
    openChat(chats[0].id);
  } else {
    newChat();
  }

  console.log("RS AI Premium V3 initialized.");
}

initializeRS();
