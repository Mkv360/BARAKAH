// ==============================
// STATE
// ==============================
let loggedIn = false;


// ==============================
// FILTER BUTTONS (only one active per type)
// ==============================
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});


// ==============================
// BOTTOM NAVIGATION
// ==============================
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    // (Future) Switch views here
    console.log("Navigated to:", item.innerText);
  });
});


// ==============================
// MODAL CONTROL
// ==============================
const authModal = document.getElementById("authModal");
const closeModalBtn = document.getElementById("closeModal");

function openModal() {
  authModal.style.display = "block";
}

function closeModal() {
  authModal.style.display = "none";
}

closeModalBtn.addEventListener("click", closeModal);

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === authModal) {
    closeModal();
  }
});


// ==============================
// CHAT BUTTONS (AUTH GATE)
// ==============================
const chatButtons = document.querySelectorAll(".chat-btn");

chatButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent unwanted bubbling

    if (!loggedIn) {
      openModal();
    } else {
      openTelegramChat();
    }
  });
});


// ==============================
// TELEGRAM CHAT (PLACEHOLDER)
// ==============================
function openTelegramChat() {
  alert("Opening Telegram chat...");

  // Later replace with real link:
  // window.open("https://t.me/username");
}


// ==============================
// VIEW PROFILE BUTTON
// ==============================
const viewButtons = document.querySelectorAll(".view-btn");

viewButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    console.log("Open Ustaz Profile");

    // Future:
    // loadProfilePage(ustazId);
  });
});


// ==============================
// DARK MODE TOGGLE (BASIC)
// ==============================
const themeToggle = document.querySelector(".icon");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
}


// ==============================
// SEARCH (BASIC FILTER)
// ==============================
const searchInput = document.querySelector(".search-bar input");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".ustaz-card");

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(value) ? "flex" : "none";
    });
  });
}