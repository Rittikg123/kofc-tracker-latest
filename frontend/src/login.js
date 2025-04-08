document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordWrapper = document.getElementById("passwordWrapper");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;

    try {
      const checkRes = await fetch(`http://localhost:5051/api/check-user?email=${encodeURIComponent(email)}`);
      const checkData = await checkRes.json();

      if (!checkData.exists) {
        // Unknown user → redirect to register
        window.location.href = `register.html?email=${encodeURIComponent(email)}`;
        return;
      }

      if (checkData.role === 'end_user') {
        // Known end user → direct login
        window.location.href = "user-dashboard.html";
        return;
      }

      if (checkData.role === 'admin') {
        // Admin → prompt for password if not already shown
        if (passwordWrapper.style.display === 'none') {
          passwordWrapper.style.display = 'block';
          messageDiv.textContent = "🔐 Enter your admin password.";
          return;
        }

        // Submit login for admin
        const loginRes = await fetch("http://localhost:5051/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: passwordInput.value,
            role: 'admin'
          }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          messageDiv.textContent = "✅ Admin login successful!";
          setTimeout(() => window.location.href = "admin-dashboard.html", 1500);
        } else {
          messageDiv.textContent = `❌ ${loginData.error || "Login failed"}`;
        }
      }
    } catch (err) {
      console.error(err);
      messageDiv.textContent = "❌ Server error. Try again later.";
    }
  });
});
