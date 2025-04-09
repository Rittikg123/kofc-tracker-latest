// frontend/src/admin-menu.js
document.addEventListener("DOMContentLoaded", () => {
    const viewUsersBtn = document.getElementById("viewUsersBtn");
    const contentArea = document.getElementById("contentArea");
    let usersVisible = false;
  
    contentArea.style.display = "none";
  
    viewUsersBtn.addEventListener("click", async () => {
      if (usersVisible) {
        contentArea.innerHTML = "";
        contentArea.style.display = "none";
        viewUsersBtn.textContent = "1. View All Users";
        usersVisible = false;
        return;
      }
  
      viewUsersBtn.textContent = "Loading...";
      try {
        const res = await fetch("http://localhost:5051/api/users");
        const users = await res.json();
  
        if (!Array.isArray(users)) {
          contentArea.innerHTML = "<p>Error loading users.</p>";
          contentArea.style.display = "block";
          viewUsersBtn.textContent = "1. View All Users";
          return;
        }
  
        const table = document.createElement("table");
        table.className = "user-table";
        table.innerHTML = `
          <thead>
            <tr>
              <th>#</th>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        `;
  
        const tbody = table.querySelector("tbody");
  
        users.forEach((user, index) => {
          const row = document.createElement("tr");
          row.dataset.userid = user.id;
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.email}</td>
            <td class="role">${user.role}</td>
            <td>
              <button class="action-btn promote" data-id="${user.id}" data-email="${user.email}" data-role="${user.role}">Promote</button>
              <button class="action-btn demote" data-id="${user.id}">Demote</button>
              <button class="action-btn delete" data-id="${user.id}">Delete</button>
            </td>
          `;
          tbody.appendChild(row);
        });
  
        contentArea.innerHTML = "";
        contentArea.appendChild(table);
        contentArea.style.display = "block";
        viewUsersBtn.textContent = "Hide All Users";
        usersVisible = true;
  
        // Promote
        document.querySelectorAll(".promote").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const email = btn.dataset.email;
            const role = btn.dataset.role;
  
            if (role === "admin") {
              return alert("User is already an admin.");
            }
  
            const password = prompt(`Set password for ${email}`);
            if (!password) return alert("Promotion cancelled. Password required.");
  
            const res = await fetch(`http://localhost:5051/api/users/${id}/promote`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password }),
            });
  
            const result = await res.json();
            alert(result.message || "User promoted");
  
            const row = document.querySelector(`tr[data-userid="${id}"]`);
            row.querySelector(".role").textContent = "admin";
            btn.dataset.role = "admin";
          });
        });
  
        // Demote
        document.querySelectorAll(".demote").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await fetch(`http://localhost:5051/api/users/${id}/demote`, { method: "PUT" });
            alert("User demoted");
  
            const row = document.querySelector(`tr[data-userid="${id}"]`);
            row.querySelector(".role").textContent = "end_user";
            row.querySelector(".promote").dataset.role = "end_user";
          });
        });
  
        // Delete
        document.querySelectorAll(".delete").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            await fetch(`http://localhost:5051/api/users/${id}`, { method: "DELETE" });
            alert("User deleted");
  
            const row = document.querySelector(`tr[data-userid="${id}"]`);
            if (row) row.remove();
          });
        });
  
      } catch (err) {
        console.error("❌ Failed to load users:", err);
        contentArea.innerHTML = "<p>Error loading users</p>";
        contentArea.style.display = "block";
        viewUsersBtn.textContent = "1. View All Users";
      }
    });
  });
  