document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");

  if (!form || !status) return;

  const API_BASE = "http://localhost:3000";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector(".contact-submit");

    const data = {
      name: document.getElementById("contact-name").value.trim(),
      email: document.getElementById("contact-email").value.trim(),
      institution: document.getElementById("contact-institution").value.trim(),
      subject: document.getElementById("contact-subject").value.trim(),
      message: document.getElementById("contact-message").value.trim(),
    };

    status.textContent = "";
    status.className = "contact-status";

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to send message.");
      }

      status.textContent = "Message sent successfully.";
      status.classList.add("success");

      form.reset();

    } catch (error) {
      console.error(error);

      status.textContent =
        "Unable to send the message. Please try again.";

      status.classList.add("error");

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send message →";
    }
  });
});