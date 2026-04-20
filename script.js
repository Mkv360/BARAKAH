// Toggle filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});

// Fake auth state
let loggedIn = false;

// Chat buttons
document.querySelectorAll(".chat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!loggedIn) {
      document.getElementById("authModal").style.display = "block";
    } else {
      alert("Open Telegram chat");
    }
  });
});

// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("authModal").style.display = "none";
});