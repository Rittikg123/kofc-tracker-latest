document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const roleSelect = document.getElementById("role");
    const passwordField = document.getElementById("password");
    const messageDiv = document.createElement("div");
    form.appendChild(messageDiv);
  
    // Initially hide password if role not selected
    passwordField.parentElement.style.display = "none";
  
    roleSelect.addEventListener("change", () => {
      if (roleSelect.value === "admin") {
        passwordField.parentElement.style.display = "block";
        passwordField.required = true;
      } else {
        passwordField.parentElement.style.display = "none";
        passwordField.required = false;
      }
    });
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const data = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        role: roleSelect.value,
      };
  
      if (roleSelect.value === "admin") {
        data.password = document.getElementById("password").value;
      }
  
      try {
        const res = await fetch("http://localhost:5051/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          messageDiv.style.color = "green";
          messageDiv.textContent = "✅ Registration successful! Redirecting...";
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          messageDiv.style.color = "red";
          messageDiv.textContent = `❌ ${result.error || "Registration failed"}`;
        }
      } catch (err) {
        console.error(err);
        messageDiv.style.color = "red";
        messageDiv.textContent = "❌ Error submitting form";
      }
    });
  });
  