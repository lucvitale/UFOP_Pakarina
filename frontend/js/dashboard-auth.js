const API_URL = "http://localhost:3000/api/auth";

const overlay = document.getElementById("dashboard-auth-overlay");
const loginForm = document.getElementById("dashboard-login-form");
const authMessage = document.getElementById("dashboard-auth-message");

function getTranslation(key, fallback) {
  const translations = window._currentTranslations || {};
  return translations[key] || fallback;
}

function showLoginOverlay() {
  if (overlay) {
    overlay.classList.add("active");
  }
}

function hideLoginOverlay() {
  if (overlay) {
    overlay.classList.remove("active");
  }
}

function showAuthMessage(message, isError = false) {
  if (!authMessage) return;

  authMessage.textContent = message;
  authMessage.className = isError
    ? "dashboard-auth-message error"
    : "dashboard-auth-message success";
}

async function checkAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    showLoginOverlay();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid or expired token");
    }

    hideLoginOverlay();

  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    showLoginOverlay();

    console.warn("[Dashboard Auth] Session expired or invalid.");
  }
}


// =========================================================
// DASHBOARD LOGIN
// =========================================================

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("dashboard-email").value.trim();
    const senha = document.getElementById("dashboard-password").value;
    const submitButton = loginForm.querySelector("button[type='submit']");

    if (!email || !senha) {
      showAuthMessage(
        getTranslation(
          "auth_missing_fields",
          "Please enter your email and password."
        ),
        true
      );
      return;
    }

    submitButton.disabled = true;

    submitButton.textContent = getTranslation(
      "auth_signing_in",
      "Signing in..."
    );

    showAuthMessage("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage;

        if (data.error === "Invalid credentials") {
          errorMessage = getTranslation(
            "auth_invalid_credentials",
            "Invalid email or password."
          );
        } else {
          errorMessage =
            data.error ||
            getTranslation(
              "auth_login_failed",
              "Login failed."
            );
        }

        showAuthMessage(errorMessage, true);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      hideLoginOverlay();

      loginForm.reset();

      const greeting = document.getElementById("user-greeting");

      if (greeting && data.user) {
        greeting.textContent =
          data.user.nome ||
          data.user.name ||
          data.user.email ||
          "";
      }

      const authButton = document.getElementById("auth-btn");

      if (authButton) {
        authButton.textContent = getTranslation(
          "nav_logout",
          "Logout"
        );

        authButton.href = "#";
      }

    } catch (err) {
      console.error("[Dashboard Auth] Login error:", err);

      showAuthMessage(
        getTranslation(
          "auth_server_error",
          "Server error. Please try again."
        ),
        true
      );

    } finally {
      submitButton.disabled = false;

      submitButton.textContent = getTranslation(
        "login_button",
        "Login"
      );
    }
  });
}


// =========================================================
// START
// =========================================================

document.addEventListener("DOMContentLoaded", checkAuth);