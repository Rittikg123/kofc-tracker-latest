document.addEventListener("DOMContentLoaded", () => {
    const exemplificationBtn = document.getElementById("exemplificationBtn");
    const catBtn = document.getElementById("catBtn");
  
    exemplificationBtn.addEventListener("click", () => {
      window.location.href = "exemplification-menu.html";
    });
  
    catBtn.addEventListener("click", () => {
      window.location.href = "cat-menu.html";
    });
  });  