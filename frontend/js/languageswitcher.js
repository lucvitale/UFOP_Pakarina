// i18n.js — Translation engine
// Supported languages: en, fr, es, pt
// To add a new language: create a new JSON file in /locales/ and add it to SUPPORTED_LANGS

const SUPPORTED_LANGS = {
  en: "English",
  fr: "Français",
  es: "Español",
  pt: "Português"
};

const DEFAULT_LANG = "en";
let currentLang = localStorage.getItem("lang") || DEFAULT_LANG;

async function loadTranslations(lang) {
  if (!Object.keys(SUPPORTED_LANGS).includes(lang)) {
    console.warn(`[i18n] Unsupported language: "${lang}". Falling back to "${DEFAULT_LANG}".`);
    lang = DEFAULT_LANG;
  }
  try {
    const base = window.location.pathname.includes("/pages/") ? "../locales" : "locales";
    const response = await fetch(`${base}/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load locales/${lang}.json`);
    return await response.json();
  } catch (err) {
    console.error("[i18n] Error loading translations:", err.message);
    return {};
  }
}

async function applyTranslations(lang) {
  const translations = await loadTranslations(lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) {
      el.textContent = translations[key];
    } else {
      console.warn(`[i18n] Missing translation key: "${key}" for lang: "${lang}"`);
    }
  });

  document.documentElement.lang = lang;
  currentLang = lang;
  localStorage.setItem("lang", lang);

  // Update button label
  const btn = document.getElementById("lang-btn");
  if (btn) btn.textContent = `${lang.toUpperCase()} ▾`;

  // Update active state in dropdown
  document.querySelectorAll(".lang-option").forEach((el) => {
    el.classList.toggle("active", el.dataset.lang === lang);
  });
}

function toggleDropdown() {
  const dropdown = document.getElementById("lang-dropdown");
  dropdown.classList.toggle("open");
}

function selectLang(lang) {
  applyTranslations(lang);
  document.getElementById("lang-dropdown").classList.remove("open");
}

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".lang-switcher")) {
    document.getElementById("lang-dropdown").classList.remove("open");
  }
});

// Build dropdown options dynamically
function buildDropdown() {
  const dropdown = document.getElementById("lang-dropdown");
  Object.entries(SUPPORTED_LANGS).forEach(([code, label]) => {
    const option = document.createElement("div");
    option.className = "lang-option";
    option.dataset.lang = code;
    option.textContent = label;
    option.onclick = () => selectLang(code);
    dropdown.appendChild(option);
  });
}

// Initialize
buildDropdown();
applyTranslations(currentLang);