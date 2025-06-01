document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordWrapper = document.getElementById("passwordWrapper");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    try {
      const checkRes = await fetch(`http://localhost:5051/api/check-user?email=${encodeURIComponent(email)}`);
      const checkData = await checkRes.json();

      if (!checkData.exists) {
        window.location.href = `register.html?email=${encodeURIComponent(email)}`;
        return;
      }

     if (checkData.role === 'end_user') {
        // Get full user record
        const loginRes = await fetch("http://localhost:5051/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem("currentUser", JSON.stringify(loginData.user));
          window.location.href = "user-dashboard.html";
        } else {
          messageDiv.textContent = `❌ ${loginData.error || "Login failed"}`;
        }

        return;
      }

      if (checkData.role === 'admin') {
        // Show password field if hidden
        if (passwordWrapper.style.display === 'none') {
          passwordWrapper.style.display = 'block';
          messageDiv.textContent = "🔐 Enter your admin password.";
          return;
        }

        const loginRes = await fetch("http://localhost:5051/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: passwordInput.value
          }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem("currentUser", JSON.stringify(loginData.user));
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