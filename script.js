// ==============================
// DATA
// ==============================
const ustazData = [
  { name: "Ahmed Ali", gender: "male", subjects: ["Tajweed", "Hifz"], rating: 4.9 },
  { name: "Fatima Hassan", gender: "female", subjects: ["Quran"], rating: 4.8 },
  { name: "Musa Ibrahim", gender: "male", subjects: ["Tajweed"], rating: 4.7 },
  { name: "Aisha Ali", gender: "female", subjects: ["Hifz"], rating: 4.9 }
];

let currentFilter = "All";


// ==============================
// INIT (SINGLE ENTRY POINT)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initFilters();
  initSearch();
  renderAll();
});


// ==============================
// LANGUAGE DROPDOWN
// ==============================
function initLanguage() {
  const langToggle = document.getElementById("langToggle");
  const langMenu = document.getElementById("langMenu");

  if (!langToggle || !langMenu) return;

  langToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.style.display =
      langMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-wrapper")) {
      langMenu.style.display = "none";
    }
  });

  document.querySelectorAll(".lang-dropdown p").forEach(item => {
    item.addEventListener("click", () => {
      const lang = item.dataset.lang;
      console.log("Language:", lang);

      // TODO: add translation logic
      langMenu.style.display = "none";
    });
  });
}


// ==============================
// THEME SYSTEM
// ==============================
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  // load saved
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light-mode");
    themeToggle.classList.replace("fa-moon", "fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");

    themeToggle.classList.replace(
      isLight ? "fa-moon" : "fa-sun",
      isLight ? "fa-sun" : "fa-moon"
    );

    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}


// ==============================
// RENDER
// ==============================
function renderAll() {
  renderPopular();
  renderList(ustazData);
}


// ==============================
// POPULAR
// ==============================
function renderPopular() {
  const container = document.getElementById("popularList");
  if (!container) return;

  container.innerHTML = ustazData.map(u => `
    <div class="small-card">
      <div class="avatar"></div>
      <div class="small-name">${u.name.split(" ")[0]}</div>
      <div class="small-rating">⭐ ${u.rating}</div>
    </div>
  `).join("");
}


// ==============================
// LIST
// ==============================
function renderList(data) {
  const container = document.getElementById("ustazList");
  if (!container) return;

  container.innerHTML = data.map(u => `
    <div class="card">
      <div class="avatar"></div>

      <div class="info">
        <div class="top">
          <div class="name">${u.name}</div>
          <div>⭐ ${u.rating}</div>
        </div>

        <div class="sub">${u.subjects.join(" • ")}</div>

        <div class="actions">
          <button class="btn chat">Chat</button>
          <button class="btn view">View</button>
        </div>
      </div>
    </div>
  `).join("");
}


// ==============================
// FILTERS
// ==============================
function initFilters() {
  const buttons = document.querySelectorAll(".filter");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.innerText;

      let filtered = ustazData;

      switch (currentFilter) {
        case "Male":
          filtered = ustazData.filter(u => u.gender === "male");
          break;
        case "Female":
          filtered = ustazData.filter(u => u.gender === "female");
          break;
        case "Hifz":
          filtered = ustazData.filter(u => u.subjects.includes("Hifz"));
          break;
        case "Tajweed":
          filtered = ustazData.filter(u => u.subjects.includes("Tajweed"));
          break;
      }

      renderList(filtered);
    });
  });
}


// ==============================
// SEARCH
// ==============================
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase();

    const filtered = ustazData.filter(u =>
      u.name.toLowerCase().includes(val) ||
      u.subjects.join(" ").toLowerCase().includes(val)
    );

    renderList(filtered);
  });
}
