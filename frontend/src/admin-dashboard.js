document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ admin-dashboard.js is running");

  const viewUsersBtn = document.getElementById("viewUsersBtn");
  const contentArea = document.getElementById("contentArea");
  let usersVisible = false;

  viewUsersBtn.addEventListener("click", async () => {
    if (usersVisible) {
      contentArea.innerHTML = "";
      viewUsersBtn.textContent = "1. View Admin Users";
      usersVisible = false;
      return;
    }

    viewUsersBtn.textContent = "Loading...";
    try {
      const res = await fetch("http://localhost:5051/users");
      const users = await res.json();

      if (!Array.isArray(users)) {
        contentArea.innerHTML = "<p>Error loading users.</p>";
        return;
      }

      const table = document.createElement("table");
      table.className = "user-table";
      table.innerHTML = `
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((user, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${user.first_name}</td>
              <td>${user.last_name}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td>
                <button class="demote-btn" data-id="${user.id}">Demote</button>
                <button class="delete-btn" data-id="${user.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      `;

      contentArea.innerHTML = "";
      contentArea.appendChild(table);
      viewUsersBtn.textContent = "Hide Admin Users";
      usersVisible = true;

      // Handle demote
      document.querySelectorAll(".demote-btn").forEach(button => {
        button.addEventListener("click", async () => {
          const userId = button.dataset.id;
          await fetch(`http://localhost:5051/users/${userId}/demote`, { method: "PUT" });
          alert("User demoted");
          viewUsersBtn.click(); // reload
        });
      });

      // Handle delete
      document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
          const userId = button.dataset.id;
          await fetch(`http://localhost:5051/users/${userId}`, { method: "DELETE" });
          alert("User deleted");
          viewUsersBtn.click(); // reload
        });
      });

    } catch (err) {
      console.error("❌ Failed to load users:", err);
      contentArea.innerHTML = "<p>Error loading users</p>";
      viewUsersBtn.textContent = "1. View Admin Users";
    }
  });
});
