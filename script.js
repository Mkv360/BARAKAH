// ==============================
// STATE
// ==============================
let loggedIn = false;
let currentFilter = "All";
let currentLocation = "Bole";
let showAllPopular = false;


// ==============================
// USTAZ DATA
// ==============================
const ustazData = [
  {
    id: 1,
    name: "Ahmed Ali",
    gender: "male",
    subjects: ["Tajweed", "Hifz"],
    location: "Bole",
    distance: 1.2,
    mosque: "Anwar Mosque",
    rating: 4.7,
    available: true
  },
  {
    id: 2,
    name: "Fatima Hassan",
    gender: "female",
    subjects: ["Quran Basics"],
    location: "Yeka",
    distance: 2.0,
    mosque: "Yeka Mosque",
    rating: 4.9,
    available: true
  },
  {
    id: 3,
    name: "Abdullah Musa",
    gender: "male",
    subjects: ["Hifz"],
    location: "Bole",
    distance: 0.8,
    mosque: "Bilal Mosque",
    rating: 4.6,
    available: false
  }
];


// ==============================
// INIT
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  renderAll();

  initFilters();
  initNav();
  initModal();
  initSearch();
  initTheme();
  initLocation();
  initSeeAll();
});


// ==============================
// RENDER ALL
// ==============================
function renderAll() {
  applyFilters();
  renderPopular();
}


// ==============================
// HERO SCROLL
// ==============================
function scrollToList() {
  document.getElementById("ustazList")
    .scrollIntoView({ behavior: "smooth" });
}


// ==============================
// RENDER USTAZ LIST
// ==============================
function renderUstazList(data) {
  const container = document.getElementById("ustazList");
  container.innerHTML = "";

  data.forEach(u => {
    const card = document.createElement("div");
    card.className = "ustaz-card";

    card.innerHTML = `
      <div class="avatar"></div>

      <div class="ustaz-info">
        <div class="top-row">
          <h4 class="name">${u.name} ✔️</h4>
          <span class="rating">⭐ ${u.rating}</span>
        </div>

        <p class="subjects">${u.subjects.join(" • ")}</p>
        <p class="location-text">📍 ${u.location} (${u.distance} km)</p>
        <p class="mosque">🕌 ${u.mosque}</p>

        <p class="status ${u.available ? "available" : ""}">
          ${u.available ? "🟢 Available" : "🔴 Not Available"}
        </p>

        <div class="actions">
          <button class="chat-btn" data-id="${u.id}">Chat</button>
          <button class="view-btn" data-id="${u.id}">View</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  attachEvents();
}


// ==============================
// POPULAR SECTION
// ==============================
function renderPopular() {
  const container = document.getElementById("popularList");

  let sorted = [...ustazData]
    .sort((a, b) => b.rating - a.rating);

  if (!showAllPopular) {
    sorted = sorted.slice(0, 5);
  }

  container.innerHTML = "";

  sorted.forEach(u => {
    container.innerHTML += `
      <div class="small-card">
        <div class="avatar"></div>
        <p class="small-name">${u.name.split(" ")[0]}</p>
        <p class="small-rating">⭐ ${u.rating}</p>
      </div>
    `;
  });
}


// ==============================
// SEE ALL BUTTON
// ==============================
function initSeeAll() {
  const seeAllBtn = document.getElementById("seeAllBtn");

  if (!seeAllBtn) return;

  seeAllBtn.onclick = () => {
    showAllPopular = !showAllPopular;
    seeAllBtn.innerText = showAllPopular ? "Show Less" : "See All";
    renderPopular();
  };
}


// ==============================
// LOCATION DROPDOWN
// ==============================
function initLocation() {
  const locationText = document.querySelector(".location");
  const dropdown = document.getElementById("locationDropdown");

  if (!locationText || !dropdown) return;

  locationText.onclick = () => {
    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  };

  dropdown.querySelectorAll("div").forEach(item => {
    item.onclick = () => {
      currentLocation = item.innerText;
      locationText.innerText = `📍 ${currentLocation} ▼`;
      dropdown.style.display = "none";

      applyFilters();
    };
  });
}


// ==============================
// FILTER SYSTEM (COMBINED)
// ==============================
function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.innerText;

      applyFilters();
    });
  });
}


// ==============================
// APPLY FILTERS + LOCATION
// ==============================
function applyFilters() {
  let filtered = ustazData.filter(u =>
    u.location === currentLocation
  );

  if (currentFilter === "Female") {
    filtered = filtered.filter(u => u.gender === "female");
  }

  if (currentFilter === "Male") {
    filtered = filtered.filter(u => u.gender === "male");
  }

  if (currentFilter === "Hifz") {
    filtered = filtered.filter(u => u.subjects.includes("Hifz"));
  }

  if (currentFilter === "Tajweed") {
    filtered = filtered.filter(u => u.subjects.includes("Tajweed"));
  }

  renderUstazList(filtered);
}


// ==============================
// SEARCH
// ==============================
function initSearch() {
  const input = document.getElementById("searchInput");

  if (!input) return;

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    const filtered = ustazData.filter(u =>
      u.name.toLowerCase().includes(value) ||
      u.subjects.join(" ").toLowerCase().includes(value) ||
      u.location.toLowerCase().includes(value)
    );

    renderUstazList(filtered);
  });
}


// ==============================
// EVENTS (CHAT / VIEW)
// ==============================
function attachEvents() {
  document.querySelectorAll(".chat-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();

      if (!loggedIn) {
        openModal();
      } else {
        openTelegramChat(btn.dataset.id);
      }
    };
  });

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.onclick = () => {
      console.log("Open profile:", btn.dataset.id);
    };
  });
}


// ==============================
// MODAL
// ==============================
function initModal() {
  const modal = document.getElementById("authModal");
  const closeBtn = document.getElementById("closeModal");

  window.openModal = () => modal.style.display = "flex";
  window.closeModal = () => modal.style.display = "none";

  closeBtn.onclick = closeModal;

  window.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}


// ==============================
// NAVIGATION
// ==============================
function initNav() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.onclick = () => {
      document.querySelectorAll(".nav-item")
        .forEach(i => i.classList.remove("active"));

      item.classList.add("active");
    };
  });
}


// ==============================
// THEME TOGGLE
// ==============================
function initTheme() {
  const toggle = document.querySelector(".theme-toggle");

  if (!toggle) return;

  toggle.onclick = () => {
    document.body.classList.toggle("light-mode");
  };
}


// ==============================
// TELEGRAM CHAT
// ==============================
function openTelegramChat(id) {
  alert("Opening chat with Ustaz ID: " + id);

  // future:
  // window.open(`https://t.me/username`);
}
