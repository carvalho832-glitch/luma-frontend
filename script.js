// =========================================
// 🌙 LUMA APP - SCRIPT.JS COMPLETO
// Menu + Chat + Diário + IA kcal + Água + Histórico + Peso + Gráficos + Ajustes
// =========================================

const API_BASE = "https://luma-api-m5vh.onrender.com";
const CHAT_API = `${API_BASE}/api/chat`;
const CALORIA_API = `${API_BASE}/api/estimar-caloria`;

const todayISO = new Date().toISOString().split("T")[0];

let lastView = "apoio";
let currentMealTarget = "";

let totalCalorias = Number(localStorage.getItem("luma_total_calorias")) || 0;
let totalAgua = Number(localStorage.getItem("luma_total_agua")) || 0;

let weightChartInstance = null;
let comboChartInstance = null;

// ELEMENTOS

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
const waterGoalLabel = document.getElementById("water-goal-label");

const addWaterBtn = document.getElementById("add-water-btn");
const resetDiaryBtn = document.getElementById("reset-diary-btn");

const diarySummary = document.getElementById("diary-summary");
const generateDiarySummaryBtn = document.getElementById("generate-diary-summary-btn");

const foodModal = document.getElementById("food-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const addBtns = document.querySelectorAll(".add-btn");
const saveMealPackBtn = document.getElementById("save-meal-pack-btn");
const commonFoodsList = document.getElementById("common-foods-list");
const modalTotalKcal = document.getElementById("modal-total-kcal");
const addCustomFoodBtn = document.getElementById("add-custom-food-btn");
const customFoodName = document.getElementById("custom-food-name");
const modalMealTitle = document.getElementById("modal-meal-title");

const diaryHistoryDate = document.getElementById("diary-history-date");
const diaryHistoryResult = document.getElementById("diary-history-result");

const weightDateInput = document.getElementById("weight-date-input");
const weightMassInput = document.getElementById("weight-mass-input");
const saveWeightBtn = document.getElementById("save-weight-btn");
const weightHistoryBucket = document.getElementById("weight-history-bucket");

const saveSettingsBtn = document.getElementById("save-settings-btn");

// BANCO LOCAL DE ALIMENTOS

const foodDB = {
  breakfast: [
    { name: "Pão Francês", kcal: 140 },
    { name: "Ovo", kcal: 90 },
    { name: "Banana", kcal: 90 },
    { name: "Café com leite", kcal: 80 },
    { name: "Tapioca média", kcal: 150 }
  ],
  lunch: [
    { name: "Arroz", kcal: 130 },
    { name: "Feijão", kcal: 90 },
    { name: "Frango", kcal: 180 },
    { name: "Salada", kcal: 30 },
    { name: "Carne bovina", kcal: 250 }
  ],
  dinner: [
    { name: "Sopa", kcal: 150 },
    { name: "Ovo", kcal: 90 },
    { name: "Frango", kcal: 180 },
    { name: "Salada", kcal: 30 },
    { name: "Omelete", kcal: 170 }
  ]
};

// HELPERS

function safeText(el, text) {
  if (el) el.textContent = text;
}

function getMealElement(meal) {
  return document.getElementById(`meal-${meal}`);
}

function getMealCalories(meal) {
  const el = getMealElement(meal);
  return parseInt(el?.dataset?.kcal, 10) || 0;
}

function updateTotalCaloriesFromMeals() {
  totalCalorias =
    getMealCalories("breakfast") +
    getMealCalories("lunch") +
    getMealCalories("dinner");

  updateCalories();
}

// NAVEGAÇÃO

function hideAllViews() {
  [viewChat, viewDiary, viewEvolucao, viewSettings].forEach(view => {
    if (view) view.classList.add("hidden");
  });

  [navApoio, navDiario, navEvolucao].forEach(nav => {
    if (!nav) return;
    nav.classList.remove("text-purple-600");
    nav.classList.add("text-gray-400");
  });

  if (settingsIcon) {
    settingsIcon.className = "fa-solid fa-gear text-lg";
  }
}

function activateNav(nav) {
  if (!nav) return;
  nav.classList.remove("text-gray-400");
  nav.classList.add("text-purple-600");
}

function navigate(viewName) {
  hideAllViews();

  if (viewName === "apoio") {
    if (viewChat) viewChat.classList.remove("hidden");

    activateNav(navApoio);

    safeText(headerTitle, "Sua Jornada");
    safeText(headerSubtitle, "Estou aqui com você 💜");

    lastView = "apoio";
  }

  if (viewName === "diario") {
    if (viewDiary) viewDiary.classList.remove("hidden");

    activateNav(navDiario);

    safeText(headerTitle, "Diário Alimentar");
    safeText(headerSubtitle, "Pequenos hábitos constroem mudanças 🌱");

    renderDiaryHistory();

    lastView = "diario";
  }

  if (viewName === "evolucao") {
    if (viewEvolucao) viewEvolucao.classList.remove("hidden");

    activateNav(navEvolucao);

    safeText(headerTitle, "Evolução");
    safeText(headerSubtitle, "Seu progresso ganhando forma 📈");

    buildWeightChart();
    buildWeightCaloriesChart();

    lastView = "evolucao";
  }

  if (viewName === "settings") {
    if (viewSettings) viewSettings.classList.remove("hidden");

    safeText(headerTitle, "Ajustes");
    safeText(headerSubtitle, "Seu espaço pessoal ✨");

    if (settingsIcon) {
      settingsIcon.className = "fa-solid fa-arrow-left text-lg";
    }
  }
}

if (navApoio) navApoio.onclick = () => navigate("apoio");
if (navDiario) navDiario.onclick = () => navigate("diario");
if (navEvolucao) navEvolucao.onclick = () => navigate("evolucao");

if (openSettingsBtn) {
  openSettingsBtn.onclick = () => {
    if (viewSettings && viewSettings.classList.contains("hidden")) {
      navigate("settings");
    } else {
      navigate(lastView);
    }
  };
}

// CHAT

function addMessage(text, isUser = false) {
  if (!chatBox || !typingIndicator) return;

  const div = document.createElement("div");

  div.className = isUser ? "user-bubble" : "ai-bubble";
  div.textContent = text;

  chatBox.insertBefore(div, typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  if (!userInput || !typingIndicator) return;

  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);

  userInput.value = "";
  typingIndicator.classList.remove("hidden");

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

    typingIndicator.classList.add("hidden");
    addMessage(data.reply || "A Luma respondeu 🌙");
  } catch (error) {
    console.error("Erro no chat:", error);

    typingIndicator.classList.add("hidden");
    addMessage("Erro ao conectar com a Luma 🌙");
  }
}

if (sendBtn) sendBtn.onclick = sendMessage;

if (userInput) {
  userInput.onkeydown = event => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
}

// HUMOR

document.querySelectorAll(".mood-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".mood-btn").forEach(b => {
      b.classList.remove("active");
    });

    btn.classList.add("active");
    localStorage.setItem("lumaMood", btn.dataset.mood || "");
  };
});

// ÁGUA E CALORIAS

function updateWater() {
  safeText(waterCount, `${totalAgua} ml`);
  localStorage.setItem("luma_total_agua", totalAgua);
}

function updateCalories() {
  safeText(calConsumed, totalCalorias);
  localStorage.setItem("luma_total_calorias", totalCalorias);
}

if (addWaterBtn) {
  addWaterBtn.onclick = () => {
    totalAgua += 250;

    updateWater();
    saveDiaryToday();
    renderDiaryHistory();
  };
}

if (resetDiaryBtn) {
  resetDiaryBtn.onclick = () => {
    totalCalorias = 0;
    totalAgua = 0;

    ["breakfast", "lunch", "dinner"].forEach(meal => {
      const el = getMealElement(meal);
      if (!el) return;

      el.textContent = "Nenhum alimento";
      el.dataset.kcal = "0";
      el.classList.remove("text-gray-700");
      el.classList.add("text-gray-400");
    });

    updateCalories();
    updateWater();
    saveDiaryToday();
    renderDiaryHistory();

    if (diarySummary) {
      diarySummary.textContent =
        "Registre suas refeições e eu te ajudo a entender seu dia. 🌙";
    }

    alert("Diário resetado 🌙");
  };
}

// IA CALORIAS

async function estimateCalories(alimento) {
  try {
    const response = await fetch(CALORIA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ alimento })
    });

    const data = await response.json();

    return parseInt(data.kcal, 10) || 0;
  } catch (error) {
    console.error("Erro ao estimar kcal:", error);
    return 0;
  }
}

// MODAL DE ALIMENTOS

function renderFoodList(mealType) {
  if (!commonFoodsList) return;

  commonFoodsList.innerHTML = "";

  const foods = foodDB[mealType] || [];

  foods.forEach(food => {
    const label = document.createElement("label");

    label.className =
      "flex justify-between items-center p-3 bg-slate-50 rounded-xl cursor-pointer font-semibold text-gray-700";

    label.innerHTML = `
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          class="food-check w-4 h-4 accent-purple-600"
          data-food="${food.name}"
          data-kcal="${food.kcal}"
        >
        <span>
          ${food.name}
          <small class="text-gray-400 block text-[10px]">${food.kcal} kcal</small>
        </span>
      </div>
    `;

    const checkbox = label.querySelector(".food-check");

    if (checkbox) {
      checkbox.onchange = calculateModalTotal;
    }

    commonFoodsList.appendChild(label);
  });

  calculateModalTotal();
}

function calculateModalTotal() {
  let total = 0;

  document.querySelectorAll(".food-check").forEach(cb => {
    if (cb.checked) {
      total += parseInt(cb.dataset.kcal, 10) || 0;
    }
  });

  safeText(modalTotalKcal, total);
}

addBtns.forEach(btn => {
  btn.onclick = () => {
    currentMealTarget = btn.dataset.mealType;

    const titles = {
      breakfast: "Café da Manhã",
      lunch: "Almoço",
      dinner: "Jantar"
    };

    safeText(modalMealTitle, titles[currentMealTarget] || "Monte seu Prato");

    if (customFoodName) customFoodName.value = "";

    renderFoodList(currentMealTarget);

    if (foodModal) foodModal.classList.remove("hidden");
  };
});

if (closeModalBtn) {
  closeModalBtn.onclick = () => {
    if (foodModal) foodModal.classList.add("hidden");
  };
}

if (addCustomFoodBtn) {
  addCustomFoodBtn.onclick = async () => {
    if (!customFoodName || !commonFoodsList) return;

    const alimento = customFoodName.value.trim();

    if (!alimento) {
      alert("Digite um alimento primeiro.");
      return;
    }

    addCustomFoodBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    addCustomFoodBtn.disabled = true;

    const kcal = await estimateCalories(alimento);

    const newItem = document.createElement("label");

    newItem.className =
      "flex justify-between items-center p-3 bg-purple-100 border border-purple-200 rounded-xl cursor-pointer font-semibold text-purple-800 mb-2 shadow-sm";

    newItem.innerHTML = `
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          checked
          class="food-check w-4 h-4 accent-purple-600"
          data-food="${alimento}"
          data-kcal="${kcal}"
        >
        <span>
          ${alimento}
          <small class="text-purple-500 block text-[10px]">
            ${kcal} kcal estimadas pela Luma IA ✨
          </small>
        </span>
      </div>
    `;

    const checkbox = newItem.querySelector(".food-check");

    if (checkbox) {
      checkbox.onchange = calculateModalTotal;
    }

    commonFoodsList.prepend(newItem);

    customFoodName.value = "";

    calculateModalTotal();

    addCustomFoodBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    addCustomFoodBtn.disabled = false;
  };
}

if (saveMealPackBtn) {
  saveMealPackBtn.onclick = () => {
    let selected = [];
    let kcalTotal = 0;

    document.querySelectorAll(".food-check").forEach(cb => {
      if (cb.checked) {
        selected.push(cb.dataset.food);
        kcalTotal += parseInt(cb.dataset.kcal, 10) || 0;
      }
    });

    const target = getMealElement(currentMealTarget);

    if (!target) return;

    if (selected.length > 0) {
      target.textContent = selected.join(", ");
      target.classList.remove("text-gray-400");
      target.classList.add("text-gray-700");
    } else {
      target.textContent = "Nenhum alimento";
      target.classList.remove("text-gray-700");
      target.classList.add("text-gray-400");
    }

    target.dataset.kcal = kcalTotal;

    updateTotalCaloriesFromMeals();

    saveDiaryToday();
    renderDiaryHistory();
    buildWeightCaloriesChart();

    if (foodModal) foodModal.classList.add("hidden");
  };
}

// HISTÓRICO DO DIÁRIO

function saveDiaryToday() {
  const history = JSON.parse(localStorage.getItem("lumaDiaryHistory") || "[]");

  const data = {
    date: todayISO,
    breakfast: getMealElement("breakfast")?.textContent || "Nenhum alimento",
    lunch: getMealElement("lunch")?.textContent || "Nenhum alimento",
    dinner: getMealElement("dinner")?.textContent || "Nenhum alimento",
    calories: totalCalorias,
    water: totalAgua
  };

  const filtered = history.filter(item => item.date !== todayISO);

  filtered.push(data);

  localStorage.setItem("lumaDiaryHistory", JSON.stringify(filtered));
}

function renderDiaryHistory() {
  if (!diaryHistoryDate || !diaryHistoryResult) return;

  if (!diaryHistoryDate.value) {
    diaryHistoryDate.value = todayISO;
  }

  const selected = diaryHistoryDate.value;
  const history = JSON.parse(localStorage.getItem("lumaDiaryHistory") || "[]");
  const found = history.find(item => item.date === selected);

  if (!found) {
    diaryHistoryResult.innerHTML = `
      <p class="text-xs text-gray-400 text-center">
        Nenhum registro encontrado.
      </p>
    `;
    return;
  }

  diaryHistoryResult.innerHTML = `
    <div class="bg-slate-50 rounded-2xl p-3 text-xs text-gray-700 space-y-2 border border-slate-100">
      <p><strong>Café:</strong> ${found.breakfast}</p>
      <p><strong>Almoço:</strong> ${found.lunch}</p>
      <p><strong>Jantar:</strong> ${found.dinner}</p>
      <p><strong>Calorias:</strong> ${found.calories} kcal</p>
      <p><strong>Água:</strong> ${found.water} ml</p>
    </div>
  `;
}

if (diaryHistoryDate) {
  diaryHistoryDate.onchange = renderDiaryHistory;
}

// RESUMO IA DO DIÁRIO

if (generateDiarySummaryBtn) {
  generateDiarySummaryBtn.onclick = async () => {
    if (!diarySummary) return;

    generateDiarySummaryBtn.textContent = "Gerando...";

    const breakfast = getMealElement("breakfast")?.textContent || "Nenhum alimento";
    const lunch = getMealElement("lunch")?.textContent || "Nenhum alimento";
    const dinner = getMealElement("dinner")?.textContent || "Nenhum alimento";

    const prompt = `
Faça um resumo alimentar curto e acolhedor com base nos dados:

Café da manhã: ${breakfast}
Almoço: ${lunch}
Jantar: ${dinner}
Água: ${totalAgua} ml
Calorias: ${totalCalorias} kcal

Dê uma orientação simples e motivadora.
`;

    try {
      const response = await fetch(CHAT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          totalCalorias,
          totalAgua
        })
      });

      const data = await response.json();

      diarySummary.textContent = data.reply || "Resumo gerado pela Luma 🌙";
    } catch (error) {
      console.error("Erro resumo:", error);
      diarySummary.textContent = "Não consegui gerar o resumo agora 🌙";
    }

    generateDiarySummaryBtn.textContent = "Gerar resumo";
  };
}

// PESO E GRÁFICOS

if (weightDateInput) {
  weightDateInput.value = todayISO;
}

if (saveWeightBtn) {
  saveWeightBtn.onclick = () => {
    const rawDate = weightDateInput?.value;
    const rawWeight = parseFloat(weightMassInput?.value);

    if (!rawDate || isNaN(rawWeight)) {
      alert("Digite data e peso.");
      return;
    }

    let history = JSON.parse(localStorage.getItem("lumaWeightHistory") || "[]");

    history = history.filter(item => item.date !== rawDate);

    history.push({
      date: rawDate,
      weight: rawWeight,
      calories: totalCalorias
    });

    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem("lumaWeightHistory", JSON.stringify(history));

    if (weightMassInput) weightMassInput.value = "";

    renderWeightHistory();
    buildWeightChart();
    buildWeightCaloriesChart();
  };
}

function renderWeightHistory() {
  if (!weightHistoryBucket) return;

  const history = JSON.parse(localStorage.getItem("lumaWeightHistory") || "[]");

  if (history.length === 0) {
    weightHistoryBucket.innerHTML = `
      <p class="text-[10px] text-gray-400 italic text-center py-1">
        Nenhum peso registrado.
      </p>
    `;
    return;
  }

  weightHistoryBucket.innerHTML = [...history]
    .reverse()
    .map(
      item => `
        <div class="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-slate-600">
          <span class="text-purple-600">${item.date}</span>
          <span class="font-black text-slate-800">${item.weight} kg</span>
        </div>
      `
    )
    .join("");
}

function buildWeightChart() {
  const canvas = document.getElementById("weightChart");

  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");
  const history = JSON.parse(localStorage.getItem("lumaWeightHistory") || "[]");

  if (weightChartInstance) {
    weightChartInstance.destroy();
  }

  weightChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.map(h => h.date),
      datasets: [
        {
          label: "Peso",
          data: history.map(h => h.weight),
          borderColor: "#9333ea",
          backgroundColor: "rgba(147,51,234,.1)",
          borderWidth: 3,
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function buildWeightCaloriesChart() {
  const canvas = document.getElementById("weightCaloriesChart");

  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");
  const history = JSON.parse(localStorage.getItem("lumaWeightHistory") || "[]");

  if (comboChartInstance) {
    comboChartInstance.destroy();
  }

  comboChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.map(h => h.date),
      datasets: [
        {
          label: "Peso",
          data: history.map(h => h.weight),
          borderColor: "#9333ea",
          borderWidth: 3,
          tension: 0.3,
          yAxisID: "peso"
        },
        {
          label: "Calorias",
          data: history.map(h => h.calories),
          borderColor: "#f59e0b",
          borderWidth: 3,
          tension: 0.3,
          yAxisID: "kcal"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        peso: {
          type: "linear",
          position: "left"
        },
        kcal: {
          type: "linear",
          position: "right",
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
}

// AJUSTES

if (saveSettingsBtn) {
  saveSettingsBtn.onclick = () => {
    const name = document.getElementById("cfg-user-name")?.value || "";
    const birth = document.getElementById("cfg-birth-date")?.value || "";
    const height = parseFloat(document.getElementById("cfg-height")?.value);
    const weight = parseFloat(document.getElementById("cfg-current-weight")?.value);
    const goal = parseFloat(document.getElementById("cfg-goal-weight")?.value);

    if (!height || !weight) {
      alert("Preencha altura e peso para calcular IMC e água.");
      return;
    }

    const imc = (weight / ((height / 100) * (height / 100))).toFixed(1);
    const water = Math.round(weight * 35);

    safeText(document.getElementById("cfg-imc-result"), imc);
    safeText(document.getElementById("cfg-water-result"), `${water}ml`);
    safeText(waterGoalLabel, `meta ${water}ml`);

    localStorage.setItem(
      "lumaProfile",
      JSON.stringify({
        name,
        birth,
        height,
        weight,
        goal,
        imc,
        water
      })
    );

    alert("Preferências salvas ✨");
  };
}

// INICIALIZAÇÃO

updateTotalCaloriesFromMeals();
updateCalories();
updateWater();
renderWeightHistory();
renderDiaryHistory();
navigate("apoio");

console.log("🌙 Luma completa online - script.js correto");
