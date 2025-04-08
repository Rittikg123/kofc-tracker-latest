// frontend/src/register.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const messageDiv = document.getElementById("message");

  const urlParams = new URLSearchParams(window.location.search);
  const emailField = document.getElementById("email");
  if (urlParams.get("email")) {
    emailField.value = urlParams.get("email");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      email: emailField.value
      // No role here — the backend will assign "end_user"
    };

    try {
      const res = await fetch("http://localhost:5051/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        messageDiv.textContent = "✅ Registration successful! Redirecting...";
        setTimeout(() => window.location.href = "user-dashboard.html", 1500);
      } else {
        messageDiv.textContent = `❌ ${result.error || "Registration failed"}`;
      }
    } catch (err) {
      console.error(err);
      messageDiv.textContent = "❌ Network error";
    }
  });
});
