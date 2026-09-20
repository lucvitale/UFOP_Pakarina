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

/**
 * Detect the initial language.
 *
 * Priority:
 * 1. Previously selected language
 * 2. Browser language, if supported
 * 3. English
 */
function getInitialLanguage() {
  const savedLang = localStorage.getItem("lang");

  if (savedLang && Object.prototype.hasOwnProperty.call(SUPPORTED_LANGS, savedLang)) {
    return savedLang;
  }

  const browserLanguage = (navigator.language || "").toLowerCase().split("-")[0];

  if (Object.prototype.hasOwnProperty.call(SUPPORTED_LANGS, browserLanguage)) {
    return browserLanguage;
  }

  return DEFAULT_LANG;
}

let currentLang = getInitialLanguage();

/**
 * Load the translation file for the selected language.
 */
async function loadTranslations(lang) {
  if (!Object.prototype.hasOwnProperty.call(SUPPORTED_LANGS, lang)) {
    console.warn(
      `[i18n] Unsupported language: "${lang}". Falling back to "${DEFAULT_LANG}".`
    );

    lang = DEFAULT_LANG;
  }

  try {
    const base = window.location.pathname.includes("/pages/")
      ? "../locales"
      : "locales";

    const response = await fetch(`${base}/${lang}.json`);

    if (!response.ok) {
      throw new Error(`Failed to load locales/${lang}.json`);
    }

    return await response.json();

  } catch (err) {
    console.error(
      "[i18n] Error loading translations:",
      err.message
    );

    return {};
  }
}

/**
 * Apply translations to the current document.
 */
async function applyTranslations(lang) {
  if (!Object.prototype.hasOwnProperty.call(SUPPORTED_LANGS, lang)) {
    lang = DEFAULT_LANG;
  }

  const translations = await loadTranslations(lang);

  window._currentTranslations = translations;

  /*
   * Text content
   */
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");

    if (translations[key] !== undefined) {
      el.textContent = translations[key];
    } else {
      console.warn(
        `[i18n] Missing translation key: "${key}" for lang: "${lang}"`
      );
    }
  });

  /*
   * Title attributes
   */
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");

    if (translations[key] !== undefined) {
      el.title = translations[key];
    }
  });

  /*
   * Placeholder attributes
   */
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");

    if (translations[key] !== undefined) {
      el.placeholder = translations[key];
    }
  });

  /*
   * ARIA labels
   */
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");

    if (translations[key] !== undefined) {
      el.setAttribute("aria-label", translations[key]);
    }
  });

  /*
   * Image alt attributes
   */
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");

    if (translations[key] !== undefined) {
      el.alt = translations[key];
    }
  });

  /*
   * Update document language
   */
  document.documentElement.lang = lang;

  currentLang = lang;

  /*
   * Persist selected language
   */
  localStorage.setItem("lang", lang);

  /*
   * Update language selector button
   */
  const btn = document.getElementById("lang-btn");

  if (btn) {
    btn.textContent = `${lang.toUpperCase()} ▾`;
  }

  /*
   * Update active language in dropdown
   */
  document.querySelectorAll(".lang-option").forEach((el) => {
    el.classList.toggle(
      "active",
      el.dataset.lang === lang
    );
  });

  /*
   * Notify other scripts.
   *
   * Dynamic modules such as weather, news, dashboard
   * and authentication can react to language changes.
   */
  document.dispatchEvent(
    new CustomEvent("languageChanged", {
      detail: {
        lang
      }
    })
  );
}

/**
 * Toggle language dropdown.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("lang-dropdown");

  if (!dropdown) {
    return;
  }

  dropdown.classList.toggle("open");
}

/**
 * Select a new language.
 */
async function selectLang(lang) {
  await applyTranslations(lang);

  const dropdown = document.getElementById("lang-dropdown");

  if (dropdown) {
    dropdown.classList.remove("open");
  }
}

/**
 * Close dropdown when clicking outside the language selector.
 */
document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("lang-dropdown");

  if (!dropdown) {
    return;
  }

  if (!e.target.closest(".lang-switcher")) {
    dropdown.classList.remove("open");
  }
});

/**
 * Build language dropdown options.
 */
function buildDropdown() {
  const dropdown = document.getElementById("lang-dropdown");

  if (!dropdown) {
    return;
  }

  /*
   * Prevent duplicated options if this function
   * is called more than once.
   */
  dropdown.innerHTML = "";

  Object.entries(SUPPORTED_LANGS).forEach(([code, label]) => {
    const option = document.createElement("div");

    option.className = "lang-option";
    option.dataset.lang = code;
    option.textContent = label;
    option.setAttribute("role", "button");
    option.setAttribute("tabindex", "0");

    option.addEventListener("click", () => {
      selectLang(code);
    });

    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectLang(code);
      }
    });

    dropdown.appendChild(option);
  });
}

/**
 * Initialize i18n after the DOM is ready.
 */
document.addEventListener("DOMContentLoaded", async () => {
  buildDropdown();

  await applyTranslations(currentLang);
});