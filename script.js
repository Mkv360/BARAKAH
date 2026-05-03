// ==============================
// STATE
// ==============================
let loggedIn = false;
let currentFilter = "All";
let currentLocation = "Bole";
let showAllPopular = false;
let currentLang = "en";


// ==============================
// LANGUAGE DATA
// ==============================
const translations = {
  en: {
    search: "Search ustaz or subject...",
    seeAll: "See all",
    showLess: "Show less",
    available: "Available",
    notAvailable: "Not Available",
    chat: "Chat",
    view: "View",
    popular: "Popular Near You"
  },
  am: {
    search: "አስተማሪ ወይም ርዕስ ፈልግ...",
    seeAll: "ሁሉን እይ",
    showLess: "ቀንስ",
    available: "ክፍት",
    notAvailable: "ዝግ",
    chat: "መልዕክት",
    view: "ዝርዝር",
    popular: "ታዋቂ በአቅራቢያ"
  }
};

// ==============================
// DATA
// ==============================
const ustazData = [
  {id:1,name:"Ahmed Ali",gender:"male",subjects:["Tajweed","Hifz"],location:"Bole",distance:1.2,mosque:"Anwar Mosque",rating:4.7,available:true},
  {id:2,name:"Abdul Karim",gender:"male",subjects:["Hifz"],location:"Bole",distance:0.8,mosque:"Bilal Mosque",rating:4.6,available:true},
  {id:3,name:"Mohamed Yusuf",gender:"male",subjects:["Tajweed"],location:"Yeka",distance:1.5,mosque:"Yeka Mosque",rating:4.8,available:true},
  {id:4,name:"Ibrahim Hassan",gender:"male",subjects:["Quran Basics"],location:"Kirkos",distance:2.2,mosque:"Kirkos Mosque",rating:4.5,available:false},
  {id:5,name:"Omar Faruk",gender:"male",subjects:["Hifz"],location:"Kolfe",distance:3.0,mosque:"Kolfe Mosque",rating:4.4,available:true},

  {id:6,name:"Fatima Hassan",gender:"female",subjects:["Quran Basics"],location:"Yeka",distance:2.0,mosque:"Yeka Mosque",rating:4.9,available:true},
  {id:7,name:"Aisha Ali",gender:"female",subjects:["Tajweed"],location:"Bole",distance:1.1,mosque:"Anwar Mosque",rating:4.8,available:true},
  {id:8,name:"Khadija Noor",gender:"female",subjects:["Hifz"],location:"Kolfe",distance:2.5,mosque:"Kolfe Mosque",rating:4.7,available:false},
  {id:9,name:"Maryam Ahmed",gender:"female",subjects:["Quran Basics"],location:"Kirkos",distance:1.9,mosque:"Kirkos Mosque",rating:4.6,available:true},
  {id:10,name:"Safiya Yusuf",gender:"female",subjects:["Tajweed"],location:"Bole",distance:0.9,mosque:"Bilal Mosque",rating:4.9,available:true}
];

// ==============================
// INIT
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  initNav();
  initModal();
  initSearch();
  initTheme();
  initLocation();
  initSeeAll();
  initLanguage();
  initScrollButtons();
  initFindBtn();

  renderAll(); // run AFTER init
});

// ==============================
// TRANSLATE
// ==============================
function t(key) {
  return translations[currentLang][key];
}

// ==============================
// RENDER
// ==============================
function renderAll() {
  applyFilters();
  renderPopular();
  applyLanguageUI(); // ✅ only UI text (no re-render)
}

// ==============================
// LOCATION
// ==============================
function initLocation() {
  const box = document.getElementById("locationBox");
  const dropdown = document.getElementById("locationDropdown");
  const label = document.getElementById("selectedLocation");

  box.onclick = (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  };

  document.querySelectorAll(".location-item").forEach(item => {
    item.onclick = () => {
      currentLocation = item.dataset.value;
      label.innerText = item.innerText;
      dropdown.classList.remove("active");
      applyFilters();
    };
  });

  document.addEventListener("click", () => {
    dropdown.classList.remove("active");
  });
}

// ==============================
// FILTERS
// ==============================
function initFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.innerText;
      applyFilters();
    };
  });
}

// ==============================
// APPLY FILTER
// ==============================
function applyFilters() {
  let filtered = ustazData.filter(u => u.location === currentLocation);

  if (currentFilter === "Male") filtered = filtered.filter(u => u.gender === "male");
  if (currentFilter === "Female") filtered = filtered.filter(u => u.gender === "female");
  if (currentFilter === "Hifz") filtered = filtered.filter(u => u.subjects.includes("Hifz"));
  if (currentFilter === "Tajweed") filtered = filtered.filter(u => u.subjects.includes("Tajweed"));

  renderUstazList(filtered);
}

// ==============================
// LIST
// ==============================
function renderUstazList(data) {
  const container = document.getElementById("ustazList");
  container.innerHTML = "";

  data.forEach(u => {
    container.innerHTML += `
      <div class="ustaz-card">
        <div class="avatar"></div>

        <div class="ustaz-info">
          <div class="top-row">
            <h4>${u.name} ✔️</h4>
            <span>⭐ ${u.rating}</span>
          </div>

          <p>${u.subjects.join(" • ")}</p>
          <p>📍 ${u.location} (${u.distance} km)</p>
          <p>🕌 ${u.mosque}</p>

          <p>
            ${u.available ? "🟢 " + t("available") : "🔴 " + t("notAvailable")}
          </p>

          <div class="actions">
            <button class="chat-btn">${t("chat")}</button>
            <button class="view-btn">${t("view")}</button>
          </div>
        </div>
      </div>
    `;
  });
}

// ==============================
// POPULAR
// ==============================
function renderPopular() {
  const container = document.getElementById("popularList");

  let sorted = [...ustazData].sort((a,b)=>b.rating-a.rating);
  if (!showAllPopular) sorted = sorted.slice(0,5);

  container.innerHTML = "";

  sorted.forEach(u => {
    container.innerHTML += `
      <div class="small-card">
        <div class="avatar"></div>
        <p>${u.name.split(" ")[0]}</p>
        <p>⭐ ${u.rating}</p>
      </div>
    `;
  });
}

// ==============================
// SEE ALL
// ==============================
function initSeeAll() {
  const btn = document.getElementById("seeAllBtn");

  btn.onclick = () => {
    showAllPopular = !showAllPopular;
    btn.innerText = showAllPopular ? t("showLess") : t("seeAll");
    renderPopular();
  };
}

// ==============================
// SEARCH
// ==============================
function initSearch() {
  const input = document.getElementById("searchInput");

  input.oninput = () => {
    const val = input.value.toLowerCase();

    const filtered = ustazData.filter(u =>
      u.name.toLowerCase().includes(val) ||
      u.subjects.join(" ").toLowerCase().includes(val)
    );

    renderUstazList(filtered);
  };
}

// ==============================
// LANGUAGE
// ==============================
function initLanguage() {
  document.querySelectorAll(".lang").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".lang").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentLang = btn.dataset.lang;
      renderAll();
    };
  });
}

// ONLY update text
function applyLanguageUI() {
  document.getElementById("searchInput").placeholder = t("search");
  document.getElementById("seeAllBtn").innerText =
    showAllPopular ? t("showLess") : t("seeAll");

  document.querySelector(".section-header h3").innerText =
    "🔥 " + t("popular");
}

// ==============================
// THEME
// ==============================
function initTheme() {
  document.querySelector(".theme-toggle").onclick = () => {
    document.body.classList.toggle("light-mode");
  };
}

// ==============================
// SCROLL BUTTONS
// ==============================
function initScrollButtons() {
  const list = document.getElementById("popularList");

  document.getElementById("scrollLeft").onclick = () => {
    list.scrollBy({ left: -200, behavior: "smooth" });
  };

  document.getElementById("scrollRight").onclick = () => {
    list.scrollBy({ left: 200, behavior: "smooth" });
  };
}

// ==============================
// FIND BUTTON
// ==============================
function initFindBtn() {
  const btn = document.getElementById("findBtn");

  if (!btn) return;

  btn.onclick = () => {
    document.getElementById("ustazList")
      .scrollIntoView({ behavior: "smooth" });
  };
}

// ==============================
// MODAL
// ==============================
function initModal() {
  const modal = document.getElementById("authModal");

  window.openModal = () => modal.style.display = "flex";
  window.closeModal = () => modal.style.display = "none";

  document.getElementById("closeModal").onclick = closeModal;
}

// ==============================
// NAV
// ==============================
function initNav() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.onclick = () => {
      document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    };
  });
}
