// ===============================
// 🌙 LUMA APP - SCRIPT COMPLETO
// CHAT + CALORIAS + HISTÓRICO
// ===============================

// -------------------------------
// API ONLINE RENDER
// -------------------------------

const CHAT_API =
  "https://luma-api-m5vh.onrender.com/api/chat";

const CALORIA_API =
  "https://luma-api-m5vh.onrender.com/api/estimar-caloria";

// -------------------------------
// ESTADO APP
// -------------------------------

let totalCalorias = 0;
let totalAgua = 1000;

let historicoPeso =
  JSON.parse(
    localStorage.getItem(
      "historicoPeso"
    )
  ) || [];

let historicoDiario =
  JSON.parse(
    localStorage.getItem(
      "historicoDiario"
    )
  ) || [];

// -------------------------------
// ELEMENTOS
// -------------------------------

const caloriasEl =
  document.getElementById(
    "total-calorias"
  );

const aguaEl =
  document.getElementById(
    "total-agua"
  );

const cafeTexto =
  document.getElementById(
    "cafe-texto"
  );

const almocoTexto =
  document.getElementById(
    "almoco-texto"
  );

const jantarTexto =
  document.getElementById(
    "jantar-texto"
  );

const calendarInput =
  document.getElementById(
    "calendar-input"
  );

const pesoAtualEl =
  document.getElementById(
    "peso-atual"
  );

const caloriasGraficoEl =
  document.getElementById(
    "calorias-grafico"
  );

const graficoCanvas =
  document.getElementById(
    "grafico"
  );

const sendBtn =
  document.getElementById(
    "send-btn"
  );

const userInput =
  document.getElementById(
    "user-input"
  );

const chatBox =
  document.getElementById(
    "chat-box"
  );

const typingIndicator =
  document.getElementById(
    "typing-indicator"
  );

// -------------------------------
// INICIALIZAÇÃO
// -------------------------------

window.onload = () => {

  atualizarInterface();

  carregarGrafico();

};

// -------------------------------
// CHAT IA
// -------------------------------

function addMessage(
  text,
  isUser = false
) {

  if (!chatBox) return;

  const div =
    document.createElement("div");

  div.className = `
    p-3 rounded-2xl shadow text-sm w-[85%] border
    ${
      isUser
        ? "bg-purple-600 text-white self-end ml-auto"
        : "bg-white text-gray-700 border-gray-100"
    }
  `;

  div.textContent = text;

  chatBox.insertBefore(
    div,
    typingIndicator
  );

  chatBox.scrollTop =
    chatBox.scrollHeight;

}

async function sendMessage() {

  const text =
    userInput.value.trim();

  if (!text) return;

  addMessage(text, true);

  userInput.value = "";

  typingIndicator.classList.remove(
    "hidden"
  );

  try {

    const response = await fetch(
      CHAT_API,
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          message: text,
          mood:
            localStorage.getItem(
              "lumaMood"
            ) || ""
        })

      }
    );

    const data =
      await response.json();

    typingIndicator.classList.add(
      "hidden"
    );

    addMessage(
      data.reply ||
        "A Luma respondeu 🌙"
    );

  } catch (erro) {

    console.log(erro);

    typingIndicator.classList.add(
      "hidden"
    );

    addMessage(
      "Erro ao conectar com a Luma 🌙"
    );

  }

}

if (sendBtn) {

  sendBtn.addEventListener(
    "click",
    sendMessage
  );

}

if (userInput) {

  userInput.addEventListener(
    "keydown",
    e => {

      if (e.key === "Enter") {
        sendMessage();
      }

    }
  );

}

// -------------------------------
// IA CALORIAS
// -------------------------------

async function estimarCalorias(
  alimento
) {

  try {

    const response = await fetch(
      CALORIA_API,
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          alimento
        })

      }
    );

    const data =
      await response.json();

    return (
      parseInt(data.kcal) || 0
    );

  } catch (erro) {

    console.log(erro);

    return 0;

  }

}

// -------------------------------
// ÁGUA
// -------------------------------

function adicionarAgua() {

  totalAgua += 250;

  aguaEl.innerText =
    `${totalAgua} ml`;

  salvarDadosHoje();

}

// -------------------------------
// REFEIÇÕES
// -------------------------------

async function adicionarRefeicao(
  tipo
) {

  const comida = prompt(
    "Digite os alimentos:"
  );

  if (!comida) return;

  const kcal =
    await estimarCalorias(
      comida
    );

  totalCalorias += kcal;

  if (tipo === "cafe") {
    cafeTexto.innerText =
      comida;
  }

  if (tipo === "almoco") {
    almocoTexto.innerText =
      comida;
  }

  if (tipo === "jantar") {
    jantarTexto.innerText =
      comida;
  }

  atualizarInterface();

  salvarDadosHoje();

  alert(
    `🍽️ ${comida}

🔥 ${kcal} kcal estimadas`
  );

}

// -------------------------------
// SALVAR DADOS
// -------------------------------

function salvarDadosHoje() {

  const hoje =
    new Date()
      .toLocaleDateString(
        "pt-BR"
      );

  const dados = {

    data: hoje,

    cafe:
      cafeTexto?.innerText ||
      "",

    almoco:
      almocoTexto?.innerText ||
      "",

    jantar:
      jantarTexto?.innerText ||
      "",

    agua: totalAgua,

    calorias:
      totalCalorias

  };

  const index =
    historicoDiario.findIndex(
      d => d.data === hoje
    );

  if (index >= 0) {

    historicoDiario[index] =
      dados;

  } else {

    historicoDiario.push(
      dados
    );

  }

  localStorage.setItem(
    "historicoDiario",
    JSON.stringify(
      historicoDiario
    )
  );

}

// -------------------------------
// HISTÓRICO
// -------------------------------

function carregarHistoricoPorData() {

  const dataSelecionada =
    calendarInput.value;

  if (!dataSelecionada)
    return;

  const partes =
    dataSelecionada.split(
      "-"
    );

  const dataBR =
    `${partes[2]}/${partes[1]}/${partes[0]}`;

  const dados =
    historicoDiario.find(
      d => d.data === dataBR
    );

  if (!dados) {

    alert(
      "Nenhum dado encontrado"
    );

    return;

  }

  cafeTexto.innerText =
    dados.cafe;

  almocoTexto.innerText =
    dados.almoco;

  jantarTexto.innerText =
    dados.jantar;

  totalAgua = dados.agua;

  totalCalorias =
    dados.calorias;

  atualizarInterface();

}

// -------------------------------
// INTERFACE
// -------------------------------

function atualizarInterface() {

  if (caloriasEl) {

    caloriasEl.innerText =
      totalCalorias;

  }

  if (aguaEl) {

    aguaEl.innerText =
      `${totalAgua} ml`;

  }

}

// -------------------------------
// LIMPAR
// -------------------------------

function limparDiario() {

  totalCalorias = 0;

  totalAgua = 1000;

  cafeTexto.innerText =
    "Nenhum alimento";

  almocoTexto.innerText =
    "Nenhum alimento";

  jantarTexto.innerText =
    "Nenhum alimento";

  atualizarInterface();

  salvarDadosHoje();

}

// -------------------------------
// PESO
// -------------------------------

function salvarPeso() {

  const peso = prompt(
    "Digite seu peso:"
  );

  if (!peso) return;

  const hoje =
    new Date()
      .toLocaleDateString(
        "pt-BR"
      );

  historicoPeso.push({

    data: hoje,

    peso:
      parseFloat(peso),

    calorias:
      totalCalorias

  });

  localStorage.setItem(
    "historicoPeso",
    JSON.stringify(
      historicoPeso
    )
  );

  carregarGrafico();

}

// -------------------------------
// GRÁFICO
// -------------------------------

function carregarGrafico() {

  if (!graficoCanvas)
    return;

  const ctx =
    graficoCanvas.getContext(
      "2d"
    );

  const labels =
    historicoPeso.map(
      p => p.data
    );

  const pesos =
    historicoPeso.map(
      p => p.peso
    );

  const calorias =
    historicoPeso.map(
      p => p.calorias
    );

  if (window.lumaChart) {

    window.lumaChart.destroy();

  }

  window.lumaChart =
    new Chart(ctx, {

      type: "line",

      data: {

        labels,

        datasets: [

          {

            label: "Peso",

            data: pesos,

            borderWidth: 3,

            tension: 0.4

          },

          {

            label:
              "Calorias",

            data: calorias,

            borderWidth: 3,

            tension: 0.4

          }

        ]

      },

      options: {

        responsive: true,

        plugins: {

          legend: {
            display: true
          }

        }

      }

    });

  if (pesos.length > 0) {

    pesoAtualEl.innerText =
      pesos[
        pesos.length - 1
      ] + " kg";

  }

  if (
    calorias.length > 0
  ) {

    caloriasGraficoEl.innerText =
      calorias[
        calorias.length - 1
      ] + " kcal";

  }

}

// -------------------------------
// NAVEGAÇÃO
// -------------------------------

function abrirTela(nome) {

  document
    .querySelectorAll(
      ".screen"
    )
    .forEach(tela => {

      tela.style.display =
        "none";

    });

  document.getElementById(
    nome
  ).style.display = "block";

}

// -------------------------------
// SERVICE WORKER
// -------------------------------

if (
  "serviceWorker"
  in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator
        .serviceWorker
        .register(
          "service-worker.js"
        );

    }
  );

}

// -------------------------------
// 🌙 LUMA READY
// -------------------------------

console.log(
  "🌙 Luma online"
);