// ==============================
// STATE
// ==============================
let loggedIn = false;
let currentFilter = "All";
let currentLocation = "Bole";
let showAllPopular = false;
let currentLang = "en";


// ==============================
// USTAZ DATA (10 USERS)
// ==============================
const ustazData = [
  {id:1,name:"Ahmed Ali",gender:"male",subjects:["Tajweed","Hifz"],location:"Bole",distance:1.2,mosque:"Anwar Mosque",rating:4.7,available:true},
  {id:2,name:"Mohamed Idris",gender:"male",subjects:["Hifz"],location:"Bole",distance:0.9,mosque:"Bilal Mosque",rating:4.8,available:true},
  {id:3,name:"Abdullah Musa",gender:"male",subjects:["Tajweed"],location:"Yeka",distance:1.5,mosque:"Yeka Mosque",rating:4.6,available:false},
  {id:4,name:"Yusuf Ahmed",gender:"male",subjects:["Quran Basics"],location:"Kirkos",distance:2.1,mosque:"Kirkos Mosque",rating:4.5,available:true},
  {id:5,name:"Ibrahim Hassan",gender:"male",subjects:["Hifz"],location:"Kolfe",distance:1.8,mosque:"Kolfe Mosque",rating:4.9,available:true},

  {id:6,name:"Fatima Hassan",gender:"female",subjects:["Quran Basics"],location:"Yeka",distance:2.0,mosque:"Yeka Mosque",rating:4.9,available:true},
  {id:7,name:"Aisha Ali",gender:"female",subjects:["Tajweed"],location:"Bole",distance:1.3,mosque:"Anwar Mosque",rating:4.8,available:true},
  {id:8,name:"Khadija Omar",gender:"female",subjects:["Hifz"],location:"Kirkos",distance:2.4,mosque:"Kirkos Mosque",rating:4.7,available:false},
  {id:9,name:"Maryam Yusuf",gender:"female",subjects:["Quran Basics"],location:"Kolfe",distance:1.7,mosque:"Kolfe Mosque",rating:4.6,available:true},
  {id:10,name:"Zainab Ahmed",gender:"female",subjects:["Tajweed","Hifz"],location:"Bole",distance:0.7,mosque:"Bilal Mosque",rating:5.0,available:true}
];


// ==============================
// INIT
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  initFilters();
  initLocation();
  initSearch();
  initTheme();
  initLanguage();
  initSeeAll();
  initModal();
});


// ==============================
// RENDER ALL
// ==============================
function renderAll() {
  applyFilters();
  renderPopular();
}


// ==============================
// LIST RENDER
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
            <h4 class="name">${u.name}</h4>
            <span class="rating">⭐ ${u.rating}</span>
          </div>

          <p class="subjects">${u.subjects.join(" • ")}</p>
          <p class="location-text">📍 ${u.location} (${u.distance} km)</p>

          <div class="actions">
            <button class="chat-btn" data-id="${u.id}">Chat</button>
            <button class="view-btn">View</button>
          </div>
        </div>
      </div>
    `;
  });

  attachEvents();
}


// ==============================
// POPULAR (SCROLLABLE)
// ==============================
function renderPopular() {
  const container = document.getElementById("popularList");

  let list = [...ustazData].sort((a,b)=>b.rating-a.rating);

  if(!showAllPopular){
    list = list.slice(0,6);
  }

  container.innerHTML = "";

  list.forEach(u=>{
    container.innerHTML += `
      <div class="small-card" data-id="${u.id}">
        <div class="avatar"></div>
        <p class="small-name">${u.name.split(" ")[0]}</p>
        <p class="small-rating">⭐ ${u.rating}</p>
      </div>
    `;
  });

  // clickable
  document.querySelectorAll(".small-card").forEach(card=>{
    card.onclick = ()=>{
      openModal();
    };
  });
}


// ==============================
// SEE ALL
// ==============================
function initSeeAll(){
  const btn = document.querySelector(".see-all");

  btn.onclick = ()=>{
    showAllPopular = !showAllPopular;
    btn.innerText = showAllPopular ? "Show Less" : "See all";
    renderPopular();
  };
}


// ==============================
// LOCATION (FIXED)
// ==============================
function initLocation(){
  const box = document.getElementById("locationBox");
  const dropdown = document.getElementById("locationDropdown");
  const text = document.getElementById("selectedLocation");

  box.onclick = (e)=>{
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  };

  document.querySelectorAll("#locationDropdown p").forEach(item=>{
    item.onclick = ()=>{
      currentLocation = item.innerText;
      text.innerText = item.innerText + ", Addis Ababa";
      dropdown.style.display = "none";
      applyFilters();
    };
  });

  document.addEventListener("click", ()=>{
    dropdown.style.display = "none";
  });
}


// ==============================
// FILTERS
// ==============================
function initFilters(){
  document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.onclick = ()=>{
      document.querySelectorAll(".filter-btn")
        .forEach(b=>b.classList.remove("active"));

      btn.classList.add("active");
      currentFilter = btn.innerText;
      applyFilters();
    };
  });
}


// ==============================
// APPLY FILTERS
// ==============================
function applyFilters(){
  let data = ustazData.filter(u=>u.location===currentLocation);

  if(currentFilter==="Male") data = data.filter(u=>u.gender==="male");
  if(currentFilter==="Female") data = data.filter(u=>u.gender==="female");
  if(currentFilter==="Hifz") data = data.filter(u=>u.subjects.includes("Hifz"));
  if(currentFilter==="Tajweed") data = data.filter(u=>u.subjects.includes("Tajweed"));

  renderUstazList(data);
}


// ==============================
// SEARCH
// ==============================
function initSearch(){
  const input = document.getElementById("searchInput");

  input.oninput = ()=>{
    const v = input.value.toLowerCase();

    const filtered = ustazData.filter(u =>
      u.name.toLowerCase().includes(v) ||
      u.subjects.join(" ").toLowerCase().includes(v)
    );

    renderUstazList(filtered);
  };
}


// ==============================
// EVENTS
// ==============================
function attachEvents(){
  document.querySelectorAll(".chat-btn").forEach(btn=>{
    btn.onclick = ()=>{
      if(!loggedIn) openModal();
    };
  });
}


// ==============================
// MODAL
// ==============================
function initModal(){
  const modal = document.getElementById("authModal");
  const close = document.getElementById("closeModal");

  window.openModal = ()=> modal.style.display="flex";
  window.closeModal = ()=> modal.style.display="none";

  close.onclick = closeModal;

  window.onclick = (e)=>{
    if(e.target===modal) closeModal();
  };
}


// ==============================
// THEME
// ==============================
function initTheme(){
  document.querySelector(".theme-toggle").onclick = ()=>{
    document.body.classList.toggle("light-mode");
  };
}


// ==============================
// 🌍 LANGUAGE (FIXED)
// ==============================
function initLanguage(){
  const btn = document.querySelector(".lang-toggle");

  if(!btn) return;

  btn.onclick = ()=>{
    currentLang = currentLang==="en" ? "am" : "en";

    btn.innerText = currentLang==="en" ? "EN" : "አማ";

    document.querySelector(".hero-title").innerText =
      currentLang==="en"
      ? "Connecting You with Qualified Quran Ustaz Easily."
      : "ተመራጭ የቁርአን አስተማሪዎችን በቀላሉ ያግኙ";
  };
}
