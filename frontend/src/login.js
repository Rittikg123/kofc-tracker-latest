document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const roleSelect = document.getElementById("role");
    const passwordInput = document.getElementById("password");
    const passwordWrapper = document.getElementById("passwordWrapper");
    const messageDiv = document.getElementById("message");
  
    // Hide password field initially
    passwordWrapper.style.display = "none";
  
    // Toggle password visibility based on role
    roleSelect.addEventListener("change", () => {
      if (roleSelect.value === "admin") {
        passwordWrapper.style.display = "block";
        passwordInput.required = true;
      } else {
        passwordWrapper.style.display = "none";
        passwordInput.required = false;
      }
    });
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const data = {
        email: document.getElementById("email").value,
        role: roleSelect.value,
        ...(roleSelect.value === "admin" && {
          password: passwordInput.value
        })
      };
  
      try {
        const res = await fetch("http://localhost:5051/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          messageDiv.style.color = "green";
          messageDiv.textContent = "✅ Login successful!";
          setTimeout(() => {
            window.location.href = roleSelect.value === "admin"
              ? "admin-dashboard.html"
              : "user-dashboard.html";
          }, 1500);
        } else {
          messageDiv.style.color = "red";
          messageDiv.textContent = `❌ ${result.error || "Login failed"}`;
        }
      } catch (error) {
        console.error(error);
        messageDiv.style.color = "red";
        messageDiv.textContent = "❌ Network error";
      }
    });
  });
  