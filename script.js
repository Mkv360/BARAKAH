// ==============================
// INIT APP
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  initNav();
  initModal();
  initChatButtons();
  initViewButtons();
  initSearch();
  initTheme();
});


// ==============================
// STATE
// ==============================
let loggedIn = false;


// ==============================
// HERO SCROLL
// ==============================
function scrollToList() {
  const list = document.querySelector(".ustaz-list");
  if (list) {
    list.scrollIntoView({ behavior: "smooth" });
  }
}


// ==============================
// FILTER SYSTEM (BETTER UX)
// ==============================
function initFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active from all
      filterButtons.forEach(b => b.classList.remove("active"));

      // Activate clicked
      btn.classList.add("active");

      console.log("Filter selected:", btn.innerText);

      // Future: filter data here
    });
  });
}


// ==============================
// BOTTOM NAVIGATION
// ==============================
function initNav() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      console.log("Navigated to:", item.innerText);

      // Future: switch pages/views
    });
  });
}


// ==============================
// MODAL CONTROL (IMPROVED)
// ==============================
function initModal() {
  const authModal = document.getElementById("authModal");
  const closeModalBtn = document.getElementById("closeModal");

  window.openModal = function () {
    authModal.style.display = "block";
  };

  window.closeModal = function () {
    authModal.style.display = "none";
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  // Click outside modal closes it
  window.addEventListener("click", (e) => {
    if (e.target === authModal) {
      closeModal();
    }
  });
}


// ==============================
// CHAT BUTTONS (AUTH REQUIRED)
// ==============================
function initChatButtons() {
  const chatButtons = document.querySelectorAll(".chat-btn");

  chatButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!loggedIn) {
        openModal();
      } else {
        openTelegramChat();
      }
    });
  });
}


// ==============================
// TELEGRAM CHAT (PLACEHOLDER)
// ==============================
function openTelegramChat() {
  alert("Opening Telegram chat...");

  // Replace later:
  // window.open("https://t.me/username");
}


// ==============================
// VIEW PROFILE BUTTON
// ==============================
function initViewButtons() {
  const viewButtons = document.querySelectorAll(".view-btn");

  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      console.log("Open Ustaz Profile");

      // Future:
      // loadProfilePage(id)
    });
  });
}


// ==============================
// SEARCH SYSTEM (IMPROVED)
// ==============================
function initSearch() {
  const searchInput = document.querySelector(".search-bar input");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".ustaz-card");

    cards.forEach(card => {
      const name = card.querySelector(".name")?.innerText.toLowerCase() || "";
      const subjects = card.querySelector(".subjects")?.innerText.toLowerCase() || "";

      if (name.includes(value) || subjects.includes(value)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
}


// ==============================
// DARK MODE TOGGLE (IMPROVED)
// ==============================
function initTheme() {
  const themeToggle = document.querySelector(".icon");

  if (!themeToggle) return;

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    console.log("Theme toggled");
  });
}