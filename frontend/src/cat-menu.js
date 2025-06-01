document.addEventListener("DOMContentLoaded", async () => {
  const welcome = document.getElementById("welcomeMessage");

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user?.first_name) {
    document.getElementById("welcomeMessage").textContent = `Welcome back, ${user.first_name}!`;
  } else {
    document.getElementById("welcomeMessage").textContent = "Welcome back!"
  }


  // Button logic
  document.getElementById("addBtn").addEventListener("click", () => {
    window.location.href = "cat-form.html";
  });

  document.getElementById("updateBtn").addEventListener("click", () => {
    window.location.href = "update-cat.html";
  });

  document.getElementById("reportBtn").addEventListener("click", () => {
    window.location.href = "report-cat.html";
  });

  document.getElementById("bulkBtn").addEventListener("click", () => {
    window.location.href = "bulk-cat.html";
  });
});