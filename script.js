// ==============================
// STATE
// ==============================
let loggedIn = false;
let currentFilter = "All";
let currentLocation = "Bole";
let showAllPopular = false;
let currentLang = "en";

// ==============================
// TRANSLATIONS
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
  renderAll();

  initFilters();
  initLocation();
  initSearch();
  initSeeAll();
  initLanguage();
  initTheme();
  initScrollButtons();
  initModal();
});

// ==============================
// HELPERS
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
}

// ==============================
// LOCATION (FIXED)
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
    item.onclick = (e) => {
      e.stopPropagation();
      currentLocation = item.innerText.split(",")[0];
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

  if (data.length === 0) {
    container.innerHTML = "<p>No ustaz found</p>";
    return;
  }

  data.forEach(u => {
    container.innerHTML += `
      <div class="ustaz-card">
        <div class="avatar"></div>

        <div class="ustaz-info">
          <div class="top-row">
            <h4>${u.name}</h4>
            <span>⭐ ${u.rating}</span>
          </div>

          <p>${u.subjects.join(" • ")}</p>
          <p>📍 ${u.location}</p>

          <p>
            ${u.available ? "🟢 " + t("available") : "🔴 " + t("notAvailable")}
          </p>

          <div class="actions">
            <button class="chat-btn">${t("chat")}</button>
            <button class="view-btn">${t("view")} →</button>
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
      <div class="small-card" onclick="openModal()">
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
  document.getElementById("seeAllBtn").onclick = () => {
    showAllPopular = !showAllPopular;
    renderPopular();
  };
}

// ==============================
// SEARCH
// ==============================
function initSearch() {
  document.getElementById("searchInput").oninput = (e) => {
    const val = e.target.value.toLowerCase();

    const filtered = ustazData.filter(u =>
      u.name.toLowerCase().includes(val)
    );

    renderUstazList(filtered);
  };
}

// ==============================
// LANGUAGE (FIXED SIMPLE)
// ==============================
function initLanguage() {
  const switchBtn = document.getElementById("langSwitch");

  switchBtn.onclick = () => {
    currentLang = currentLang === "en" ? "am" : "en";
    applyLanguage();
  };
}

function applyLanguage() {
  document.getElementById("searchInput").placeholder = t("search");
  document.querySelector(".section-title").innerText = "🔥 " + t("popular");
  renderAll();
}

// ==============================
// THEME
// ==============================
function initTheme() {
  const toggle = document.querySelector(".theme-toggle");

  toggle.onclick = () => {
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
// MODAL
// ==============================
function initModal() {
  const modal = document.getElementById("authModal");

  window.openModal = () => modal.style.display = "flex";
  window.closeModal = () => modal.style.display = "none";

  document.getElementById("closeModal").onclick = closeModal;
}

// ==============================
// HERO BUTTON FIX
// ==============================
function scrollToList() {
  document.getElementById("ustazList").scrollIntoView({
    behavior: "smooth"
  });
}
