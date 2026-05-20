/* =========================
   LUMA APP - SCRIPT COMPLETO
   Frontend conectado ao Render
========================= */

const API_BASE = "https://luma-api-m5vh.onrender.com";
const CHAT_API = `${API_BASE}/api/chat`;
const CALORIA_API = `${API_BASE}/api/estimar-caloria`;

let lastView = "apoio";
let totalCalorias = Number(localStorage.getItem("luma_total_calorias")) || 0;
let totalAgua = Number(localStorage.getItem("luma_total_agua")) || 0;

const navApoio = document.getElementById("nav-apoio");
const navDiario = document.getElementById("nav-diario");
const navEvolucao = document.getElementById("nav-evolucao");

const viewChat = document.getElementById("view-chat");
const viewDiary = document.getElementById("view-diary");
const viewEvolucao = document.getElementById("view-evolucao");
const viewSettings = document.getElementById("view-settings");

const openSettingsBtn = document.getElementById("open-settings-btn");
const settingsIcon = document.getElementById("settings-icon");
const headerTitle = document.getElementById("header-title");
const headerSubtitle = document.getElementById("header-subtitle");

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing-indicator");

const calConsumed = document.getElementById("cal-consumed");
const waterCount = document.getElementById("water-count");

/* =========================
   NAVEGAÇÃO
========================= */

function hideAllViews() {
  [viewChat, viewDiary, viewEvolucao, viewSettings].forEach(view => {
    if (view) view.classList.add("hidden");
  });

  [navApoio, navDiario, navEvolucao].forEach(nav => {
    if (!nav) return;
    nav.classList.remove("text-purple-600");
    nav.classList.add("text-gray-400");
  });
}

function setActiveNav(nav) {
  if (!nav) return;
  nav.classList.remove("text-gray-400");
  nav.classList.add("text-purple-600");
}

function navigate(viewName) {
  hideAllViews();

  if (settingsIcon) {
    settingsIcon.className = "fa-solid fa-gear text-lg";
  }

  if (viewName === "apoio") {
    if (viewChat) viewChat.classList.remove("hidden");
    setActiveNav(navApoio);
    if (headerTitle) headerTitle.textContent = "Sua Jornada";
    if (headerSubtitle) headerSubtitle.textContent = "Estou aqui com você 💜";
    lastView = "apoio";
  }

  if (viewName === "diario") {
    if (viewDiary) viewDiary.classList.remove("hidden");
    setActiveNav(navDiario);
    if (headerTitle) headerTitle.textContent = "Diário Alimentar";
    if (headerSubtitle) headerSubtitle.textContent = "Um passo leve por vez 🥗";
    lastView = "diario";
    atualizarInterface();
  }

  if (viewName === "evolucao") {
    if (viewEvolucao) viewEvolucao.classList.remove("hidden");
    setActiveNav(navEvolucao);
    if (headerTitle) headerTitle.textContent = "Evolução";
    if (headerSubtitle) headerSubtitle.textContent = "Seu progresso ganhando forma 📊";
    lastView = "evolucao";
  }

  if (viewName === "settings") {
    if (viewSettings) viewSettings.classList.remove("hidden");
    if (headerTitle) headerTitle.textContent = "Ajustes";
    if (headerSubtitle) headerSubtitle.textContent = "Configurações da Luma ✨";
    if (settingsIcon) settingsIcon.className = "fa-solid fa-arrow-left text-lg";
  }
}

if (navApoio) navApoio.addEventListener("click", () => navigate("apoio"));
if (navDiario) navDiario.addEventListener("click", () => navigate("diario"));
if (navEvolucao) navEvolucao.addEventListener("click", () => navigate("evolucao"));

if (openSettingsBtn) {
  openSettingsBtn.addEventListener("click", () => {
    if (viewSettings && viewSettings.classList.contains("hidden")) {
      navigate("settings");
    } else {
      navigate(lastView);
    }
  });
}

/* =========================
   CHAT COM IA
========================= */

function addMessage(text, isUser = false) {
  if (!chatBox || !typingIndicator) return;

  const div = document.createElement("div");

  div.className = `
    p-3 rounded-2xl shadow text-sm w-[85%] border
    ${isUser
      ? "bg-purple-600 text-white self-end ml-auto"
      : "bg-white text-gray-700 border-gray-100"
    }
  `;

  div.textContent = text;
  chatBox.insertBefore(div, typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  if (!userInput) return;

  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  userInput.value = "";

  if (typingIndicator) typingIndicator.classList.remove("hidden");

  try {
    const response = await fetch(CHAT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        mood: localStorage.getItem("lumaMood") || "",
        totalCalorias,
        totalAgua
      })
    });

    const data = await response.json();

    if (typingIndicator) typingIndicator.classList.add("hidden");

    addMessage(data.reply || "A Luma respondeu, mas sem texto 🌙");
  } catch (error) {
    console.error(error);

    if (typingIndicator) typingIndicator.classList.add("hidden");

    addMessage("Erro ao conectar com a Luma. Tente novamente em instantes 🌙");
  }
}

if (sendBtn) sendBtn.addEventListener("click", sendMessage);

if (userInput) {
  userInput.addEventListener("keydown", event => {
    if (event.key === "Enter") sendMessage();
  });
}

/* =========================
   ESTIMATIVA DE CALORIAS
========================= */

async function estimarCalorias(alimento) {
  try {
    const response = await fetch(CALORIA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ alimento })
    });

    const data = await response.json();

    return Number(data.kcal) || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function adicionarRefeicao(tipo) {
  const alimento = prompt("Digite os alimentos da refeição:");

  if (!alimento) return;

  const kcal = await estimarCalorias(alimento);

  totalCalorias += kcal;

  localStorage.setItem("luma_total_calorias", totalCalorias);

  atualizarInterface();

  alert(`${alimento}\n\n🔥 ${kcal} kcal estimadas`);
}

/* =========================
   ÁGUA
========================= */

function adicionarAgua() {
  totalAgua += 250;

  localStorage.setItem("luma_total_agua", totalAgua);

  atualizarInterface();
}

/* =========================
   INTERFACE
========================= */

function atualizarInterface() {
  if (calConsumed) calConsumed.textContent = totalCalorias;
  if (waterCount) waterCount.textContent = `${totalAgua} ml`;
}

/* =========================
   HUMOR
========================= */

document.querySelectorAll(".mood-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mood-btn").forEach(b => {
      b.classList.remove("active");
    });

    btn.classList.add("active");

    localStorage.setItem("lumaMood", btn.dataset.mood || "");
  });
});

/* =========================
   PWA
========================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

/* =========================
   INICIALIZAÇÃO
========================= */

atualizarInterface();

console.log("Luma conectada ao Render 🌙");
