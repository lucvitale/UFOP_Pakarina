const API_URL = "http://localhost:3000/api/auth";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authMessage = document.getElementById("auth-message");

function getTranslation(key, fallback) {
  const translations = window._currentTranslations || {};
  return translations[key] || fallback;
}

function showMessage(message, isError = false) {
  if (!authMessage) return;

  authMessage.textContent = message;
  authMessage.style.color = isError ? "#e74c3c" : "#27ae60";
  authMessage.style.marginBottom = "1rem";
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "dashboard.html";
      } else {
  let errorMessage;

  if (data.error === "Invalid credentials") {
    errorMessage = getTranslation(
      "auth_invalid_credentials",
      "Invalid credentials"
    );
  } else {
    errorMessage =
      data.error ||
      getTranslation("auth_login_failed", "Login failed");
  }

  showMessage(errorMessage, true);
}
    } catch (err) {
      showMessage(
        getTranslation(
          "auth_server_error",
          "Server error. Please try again."
        ),
        true
      );
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "login.html";
      } else {
        showMessage(
          data.error ||
            getTranslation("auth_registration_failed", "Registration failed"),
          true
        );
      }
    } catch (err) {
      showMessage(
        getTranslation(
          "auth_server_error",
          "Server error. Please try again."
        ),
        true
      );
    }
  });
}

document.addEventListener("languageChanged", () => {
  // The message is only updated when a new authentication error occurs.
});