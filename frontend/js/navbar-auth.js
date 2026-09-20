document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("auth-btn");
  const userGreeting = document.getElementById("user-greeting");

  if (!authBtn) return;

  function updateAuthButton() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const translations = window._currentTranslations || {};

    if (token && user) {
      if (userGreeting) {
        userGreeting.textContent =
          user.nome || user.name || user.email || "";
      }

      authBtn.setAttribute("data-i18n", "nav_logout");
      authBtn.textContent = translations.nav_logout || "Logout";
      authBtn.href = "#";
    } else {
      if (userGreeting) {
        userGreeting.textContent = "";
      }

      authBtn.setAttribute("data-i18n", "nav_login");
      authBtn.textContent = translations.nav_login || "Login";

      authBtn.href = window.location.pathname.includes("/pages/")
        ? "login.html"
        : "pages/login.html";
    }
  }

  updateAuthButton();

  authBtn.addEventListener("click", (event) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    event.preventDefault();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  });

  document.addEventListener("languageChanged", () => {
    updateAuthButton();
  });
});