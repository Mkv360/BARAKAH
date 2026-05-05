const ustazData = [
  {name:"Ahmed Ali", gender:"male", subjects:["Tajweed","Hifz"], rating:4.9},
  {name:"Fatima Hassan", gender:"female", subjects:["Quran"], rating:4.8},
  {name:"Musa Ibrahim", gender:"male", subjects:["Tajweed"], rating:4.7},
  {name:"Aisha Ali", gender:"female", subjects:["Hifz"], rating:4.9}
];

let currentFilter = "All";

// ==============================
// LANGUAGE DROPDOWN
// ==============================
const langToggle = document.getElementById("langToggle");
const langMenu = document.getElementById("langMenu");

langToggle.addEventListener("click", () => {
  langMenu.style.display =
    langMenu.style.display === "block" ? "none" : "block";
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".lang-wrapper")) {
    langMenu.style.display = "none";
  }
});

// Language select
document.querySelectorAll(".lang-dropdown p").forEach(item => {
  item.addEventListener("click", () => {
    const lang = item.getAttribute("data-lang");
    console.log("Selected language:", lang);

    // FUTURE: translate UI here
    langMenu.style.display = "none";
  });
});


// ==============================
// THEME TOGGLE (DARK / LIGHT)
// ==============================
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  // Change icon
  if (document.body.classList.contains("light-mode")) {
    themeToggle.classList.remove("fa-moon");
    themeToggle.classList.add("fa-sun");
  } else {
    themeToggle.classList.remove("fa-sun");
    themeToggle.classList.add("fa-moon");
  }

  // Save preference
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode") ? "light" : "dark"
  );
});


// ==============================
// LOAD SAVED THEME
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.classList.remove("fa-moon");
    themeToggle.classList.add("fa-sun");
  }
});

// INIT
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  initFilters();
  initSearch();
});

// RENDER ALL
function renderAll() {
  renderPopular();
  renderList(ustazData);
}

// POPULAR
function renderPopular() {
  const container = document.getElementById("popularList");
  container.innerHTML = "";

  ustazData.forEach(u => {
    container.innerHTML += `
      <div class="small-card">
        <div class="avatar"></div>
        <div class="small-name">${u.name.split(" ")[0]}</div>
        <div class="small-rating">⭐ ${u.rating}</div>
      </div>
    `;
  });
}

// LIST
function renderList(data) {
  const container = document.getElementById("ustazList");
  container.innerHTML = "";

  data.forEach(u => {
    container.innerHTML += `
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
    `;
  });
}

// FILTERS
function initFilters() {
  document.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.innerText;

      let filtered = ustazData;

      if (currentFilter === "Male") {
        filtered = ustazData.filter(u => u.gender === "male");
      }

      if (currentFilter === "Female") {
        filtered = ustazData.filter(u => u.gender === "female");
      }

      if (currentFilter === "Hifz") {
        filtered = ustazData.filter(u => u.subjects.includes("Hifz"));
      }

      if (currentFilter === "Tajweed") {
        filtered = ustazData.filter(u => u.subjects.includes("Tajweed"));
      }

      renderList(filtered);
    };
  });
}

// SEARCH
function initSearch() {
  const input = document.getElementById("searchInput");

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase();

    const filtered = ustazData.filter(u =>
      u.name.toLowerCase().includes(val) ||
      u.subjects.join(" ").toLowerCase().includes(val)
    );

    renderList(filtered);
  });
}
