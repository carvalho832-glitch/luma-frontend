/* =========================================
   RESET
========================================= */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #ececec;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* =========================================
   APP
========================================= */

#app-shell {
  transition: all 0.3s ease;
}

/* =========================================
   SCROLL
========================================= */

::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* =========================================
   MOOD BUTTONS
========================================= */

.mood-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  font-size: 18px;
  transition: 0.2s;
}

.mood-btn:active {
  transform: scale(0.92);
}

/* =========================================
   NAV
========================================= */

.nav-item {
  transition: 0.2s;
}

.nav-item.active {
  color: #9333ea;
}

/* =========================================
   MEAL CARD
========================================= */

.meal-card {
  background: white;
  border-radius: 24px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.04);
  border: 1px solid #f1f1f1;
}

.meal-card h3 {
  font-size: 14px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 3px;
}

.meal-card p {
  font-size: 11px;
  color: #6b7280;
  line-height: 1.4;
}

/* =========================================
   ICON
========================================= */

.meal-icon {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* =========================================
   ADD BTN
========================================= */

.add-btn {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(
    135deg,
    #9333ea,
    #4f46e5
  );
  color: white;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(147,51,234,0.3);
  transition: 0.2s;
}

.add-btn:active {
  transform: scale(0.92);
}

/* =========================================
   INPUT
========================================= */

.input-field {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 13px;
  font-weight: 600;
  outline: none;
  color: #374151;
}

.input-field:focus {
  border-color: #9333ea;
  background: white;
}

/* =========================================
   FOOD OPTION
========================================= */

.food-option {
  background: #f8fafc;
  border-radius: 18px;
  padding: 14px;
  border: 1px solid #edf0f3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.food-option.selected {
  background: #f3e8ff;
  border-color: #d8b4fe;
}

.food-option input {
  width: 20px;
  height: 20px;
  accent-color: #9333ea;
}

.food-option-name {
  font-size: 13px;
  font-weight: 800;
  color: #374151;
}

.food-option-kcal {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

/* =========================================
   CHAT BALLOON
========================================= */

.user-bubble {
  background: linear-gradient(
    135deg,
    #9333ea,
    #7c3aed,
    #4f46e5
  );

  color: white;
  padding: 14px 18px;
  border-radius: 22px;
  width: fit-content;
  max-width: 85%;
  margin-left: auto;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 0 8px 20px rgba(147,51,234,0.25);
}

.ai-bubble {
  background: white;
  color: #374151;
  padding: 14px 18px;
  border-radius: 22px;
  width: fit-content;
  max-width: 85%;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid #f1f1f1;
  box-shadow: 0 6px 18px rgba(0,0,0,0.04);
}

/* =========================================
   BUTTONS
========================================= */

button {
  cursor: pointer;
  border: none;
}

/* =========================================
   CHART
========================================= */

canvas {
  width: 100% !important;
  height: 100% !important;
}

/* =========================================
   MOBILE
========================================= */

@media (max-width: 430px) {

  body {
    align-items: stretch !important;
  }

  #app-shell {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0;
    border: none;
  }

}
