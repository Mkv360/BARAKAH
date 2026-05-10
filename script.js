document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("findUstazBtn")) return;

  // ONLY run homepage code here
});

// ==============================
// DATA
// ==============================
const ustazData = [
  // 👨 MALE (10)
  { name: "Ahmed Ali", gender: "male", subjects: ["Tajweed", "Hifz"], rating: 4.9 },
  { name: "Yusuf Mohammed", gender: "male", subjects: ["Quran"], rating: 4.7 },
  { name: "Abdul Rahman", gender: "male", subjects: ["Tajweed"], rating: 4.6 },
  { name: "Omar Hassan", gender: "male", subjects: ["Hifz"], rating: 4.8 },
  { name: "Bilal Ahmed", gender: "male", subjects: ["Quran"], rating: 4.5 },
  { name: "Ibrahim Ali", gender: "male", subjects: ["Tafseer"], rating: 4.7 },
  { name: "Khalid Umar", gender: "male", subjects: ["Tajweed"], rating: 4.6 },
  { name: "Suleiman Yusuf", gender: "male", subjects: ["Hifz"], rating: 4.9 },
  { name: "Hassan Ibrahim", gender: "male", subjects: ["Quran"], rating: 4.4 },
  { name: "Mustafa Ali", gender: "male", subjects: ["Tafseer"], rating: 4.8 },

  // 👩 FEMALE (10)
  { name: "Fatima Hassan", gender: "female", subjects: ["Quran"], rating: 4.9 },
  { name: "Aisha Ali", gender: "female", subjects: ["Hifz"], rating: 4.8 },
  { name: "Zainab Mohammed", gender: "female", subjects: ["Tajweed"], rating: 4.7 },
  { name: "Khadija Yusuf", gender: "female", subjects: ["Quran"], rating: 4.6 },
  { name: "Maryam Ibrahim", gender: "female", subjects: ["Tafseer"], rating: 4.8 },
  { name: "Hafsa Omar", gender: "female", subjects: ["Hifz"], rating: 4.9 },
  { name: "Sumaya Ali", gender: "female", subjects: ["Tajweed"], rating: 4.5 },
  { name: "Nafisa Hassan", gender: "female", subjects: ["Quran"], rating: 4.7 },
  { name: "Safiya Mohammed", gender: "female", subjects: ["Tafseer"], rating: 4.6 },
  { name: "Ruqayya Yusuf", gender: "female", subjects: ["Hifz"], rating: 4.8 }
];
// ==============================
// BACKEND URL
// ==============================
const BASE_URL = "http://localhost/BarakaLink/backend";

let currentFilter = "All";

function handleRoleChange(role) {
  const ustazFields = document.getElementById("ustazFields");
  if (!ustazFields) return;

  if (role === "ustaz") {
    ustazFields.classList.remove("hidden");
  } else {
    ustazFields.classList.add("hidden");
  }
}




// ==============================
// INIT (INDEX PAGE ONLY)
// ==============================
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // AUTH CHECK (REDIRECT)
  // =========================
  if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "welcome.html";
    return;
  }

  // If index elements don't exist → stop
  if (!document.getElementById("findUstazBtn")) return;

  // =========================
  // INIT HOMEPAGE
  // =========================
  initTheme();
  initLanguage();
  initFilters();
  initSearch();
  renderAll();

  // =========================
  // SEE ALL POPULAR
  // =========================
  const seeAllBtn = document.querySelector(".see-all");

  if (seeAllBtn) {
    seeAllBtn.addEventListener("click", () => {
      document.getElementById("ustazList").scrollIntoView({
        behavior: "smooth"
      });
    });
  }

  // =========================
  // CUSTOM ROLE SELECT
  // =========================
  const roleSelectBox = document.querySelector("#roleSelect .select-box");
  const roleDropdown = document.querySelector("#roleSelect .dropdown");
  const roleText = document.getElementById("roleText");

  window.selectedRole = "";

  if (roleSelectBox && roleDropdown) {
    roleSelectBox.addEventListener("click", () => {
      roleDropdown.classList.toggle("hidden");
    });

    roleDropdown.querySelectorAll(".option").forEach(opt => {
      opt.addEventListener("click", () => {
        window.selectedRole = opt.dataset.value;
        roleText.innerText = opt.innerText;

        handleRoleChange(window.selectedRole);
        roleDropdown.classList.add("hidden");
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#roleSelect")) {
        roleDropdown.classList.add("hidden");
      }
    });
  }

  // =========================
  // FIND USTAZ BUTTON
  // =========================
  const findBtn = document.getElementById("findUstazBtn");

  if (findBtn) {
    findBtn.addEventListener("click", () => {
      document.getElementById("popularSection").scrollIntoView({
        behavior: "smooth"
      });
    });
  }

});
  // ==============================
  // LANGUAGE DROPDOWN
 // ==============================
 // ==============================
// LANGUAGE DROPDOWN (FIXED)
// ==============================
function initLanguage() {
  const langWrapper = document.querySelector(".lang-wrapper");
  const langToggle = document.getElementById("langToggle");
  const langMenu = document.getElementById("langMenu");

  if (!langWrapper || !langToggle || !langMenu) return;

  // toggle dropdown
  langToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    langWrapper.classList.toggle("active");
  });

  // close when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-wrapper")) {
      langWrapper.classList.remove("active");
    }
  });

  // language select
  document.querySelectorAll(".lang-dropdown p").forEach(item => {
    item.addEventListener("click", () => {
      const lang = item.dataset.lang;

      console.log("Language:", lang);
      localStorage.setItem("lang", lang);

      langWrapper.classList.remove("active");
    });
  });
}


// ==============================
// THEME SYSTEM (FIXED)
// ==============================
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem("theme");

  // apply saved theme on load
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.classList.remove("fa-moon");
    themeToggle.classList.add("fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");

    if (isLight) {
      themeToggle.classList.remove("fa-moon");
      themeToggle.classList.add("fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      themeToggle.classList.remove("fa-sun");
      themeToggle.classList.add("fa-moon");
      localStorage.setItem("theme", "dark");
    }
  });
}
 // ==============================
  // RENDER
 // ==============================
 let pendingAction = null;

 function requireAuth(action) {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    pendingAction = action;
    overlay.style.display = "flex";
    showSignup();
    return;
  }

  action();
 }

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

  container.innerHTML = ustazData.map(u =>
    `<div class="small-card" onclick="openPopularProfile('${u.name}')">
      <div class="avatar"></div>
      <div class="small-name">${u.name.split(" ")[0]}</div>
      <div class="small-rating">⭐ ${u.rating}</div>
    </div>`
  ).join("");
 }

  // ==============================
  // LIST
  // ==============================
 let showAllUstaz = false;

function renderList(data) {
  const container = document.getElementById("ustazList");
  if (!container) return;

  const visibleData = showAllUstaz ? data : data.slice(0, 10);

  container.innerHTML = `
    ${visibleData.map(u =>
      `<div class="card">
        <div class="avatar"></div>
        <div class="info">
          <div class="top">
            <div class="name">${u.name}</div>
            <div>⭐ ${u.rating}</div>
          </div>
          <div class="sub">${u.subjects.join(" • ")}</div>
          <div class="actions">
            <button class="btn chat" onclick="requireAuth(() => openChat('${u.name}'))">
              Chat
            </button>
            <button class="btn view" onclick="requireAuth(() => openProfile('${u.name}'))">
              View
            </button>
          </div>
        </div>
      </div>`
    ).join("")}

    <div class="see-more-wrapper">
      <span id="seeMoreBtn" class="see-more">
        ${showAllUstaz ? "Show Less ↑" : "See More ↓"}
      </span>
    </div>
  `;

  // attach click after render
  const btn = document.getElementById("seeMoreBtn");
  if (btn) {
    btn.onclick = () => {
      showAllUstaz = !showAllUstaz;
      renderList(data);
    };
  }
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

 function openPopularProfile(name) {
  requireAuth(() => {
    openProfile(name);
  });
 }

  // ===============================
 // ELEMENTS
 // ===============================
const overlay = document.getElementById("authOverlay");
const loginBtn = document.querySelector(".login");
const signupBtn = document.querySelector(".signup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const closeAuth = document.getElementById("closeAuth");
const goSignup = document.getElementById("goSignup");
const goLogin = document.getElementById("goLogin");
// ===============================
// OPEN MODAL
// ===============================
if (loginBtn && overlay) {
  loginBtn.onclick = () => {
    overlay.style.display = "flex";
    showLogin();
  };
}

if (signupBtn && overlay) {
  signupBtn.onclick = () => {
    overlay.style.display = "flex";
    showSignup();
  };
}

// ===============================
// CLOSE MODAL
// ===============================
if (closeAuth && overlay) {

  closeAuth.onclick = () => {
    overlay.style.display = "none";
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
    }
  };

}
  // ===============================
  // SWITCH FORMS
 // ===============================
 function showLogin() {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  document.getElementById("authTitle").innerText = "Welcome Back";
 }

 function showSignup() {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  document.getElementById("authTitle").innerText = "Create Account";
 }

 if (goSignup) goSignup.onclick = showSignup;
 if (goLogin) goLogin.onclick = showLogin;

  // ===============================
  // PASSWORD TOGGLE 👁
  // ===============================
 document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
 });

 // ===============================
 // ETHIOPIAN PHONE VALIDATION 🇪🇹
 // ===============================
 function validatePhone(phone) {
  const p = phone.replace(/\s+/g, "");

  if (/^9\d{8}$/.test(p)) return "+251" + p;
  if (/^0[79]\d{8}$/.test(p)) return "+251" + p.slice(1);

  return null;
 }
 
 // ===============================
// LOGIN
// ===============================
 function login() {
  const phoneInput = document.getElementById("loginPhone").value;
  const pass = document.getElementById("loginPassword").value;

  const phone = validatePhone(phoneInput);

  if (!phone || !pass) {
    alert("Enter valid Ethiopian phone and password");
    return;
  }

  console.log("LOGIN:", phone, pass);

  // ✅ SAVE LOGIN STATE
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("userPhone", phone);

  alert("Login successful");

  // ✅ REDIRECT TO DASHBOARD
  window.location.href = "welcome.html";
}
// ===============================
// SIGNUP (UPDATED)
// ===============================
function signup() {
  const role = window.selectedRole;

  const first = document.getElementById("firstName").value.trim();
  const last = document.getElementById("lastName").value.trim();
  const name = first + " " + last;

  if (!first || !last) {
    alert("Enter first and last name");
    return;
  }

  const phoneInput = document.getElementById("signupPhone").value;
  const subcityVal = document.getElementById("subcity").value;
  const areaVal = document.getElementById("area").value;
  const pass = document.getElementById("signupPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  const phone = validatePhone(phoneInput);

  if (pass !== confirmPass) {
    alert("Passwords do not match");
    return;
  }

  if (!role || !name || !phone || !subcityVal || !areaVal || !pass || !confirmPass) {
    alert("Please fill all required fields");
    return;
  }

  let exp = null;
  let gender = null;

  if (role === "ustaz") {
    exp = document.getElementById("experience").value;
    gender = document.getElementById("gender").value;

    if (!exp || !gender) {
      alert("Fill experience and gender");
      return;
    }
  }

  console.log("SIGNUP DATA READY:", {
    role,
    name,
    phone,
    subcity: subcityVal,
    area: areaVal,
    password: pass,
    experience: exp,
    gender: gender
  });
  localStorage.setItem("tempRole", role);
  localStorage.setItem("tempUser", JSON.stringify({
  name,
  phone,
  subcity: subcityVal,
  area: areaVal
  }));

  // ===============================
  // SEND OTP (CORRECT PLACE)
  // ===============================
  fetch(BASE_URL + "/send_otp.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      role,
      name,
      phone,
      subcity: subcityVal,
      area: areaVal,
      password: pass,
      experience: exp,
      gender: gender
    })
  })
  .then(res => res.json())
  .then(data => {

    console.log("OTP RESPONSE:", data);

if (data.success) {

  alert("OTP sent!");

  // hide signup form
  document.getElementById("signupForm").classList.add("hidden");

  // hide auth modal close icon
  document.getElementById("closeAuth").style.display = "none";

  // hide auth title
  document.getElementById("authTitle").style.display = "none";

  // show OTP popup
  document.getElementById("otpSection").classList.remove("hidden");
    } else {
      alert(data.message || "OTP failed");
    }

  })
  .catch(err => console.error(err));
}
// ===============================
// VERIFY OTP
// ===============================
function verifyOTP() {

  const otp = document.getElementById("otpInput").value.trim();

  if (!otp) {
    alert("Enter OTP");
    return;
  }

  fetch(BASE_URL + "/verify_otp.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ otp })
  })
  .then(res => res.json())
  .then(data => {

    console.log("VERIFY RESPONSE:", data);

    if (data.success) {

     alert("OTP Verified!");

     // IMPORTANT: pass user state if needed
     const role = localStorage.getItem("tempRole");

     if (role === "ustaz") {
      window.location.href = "ustaz_profile_setup.html";
    } else {
      window.location.href = "welcome.html";
    }

    } else {
      alert(data.message || "Invalid OTP");
    }

  })
  .catch(err => {
    console.error(err);
    alert("Server error");
  });
}

// CLOSE OTP BOX
function closeOTP() {

  document.getElementById("otpSection").classList.add("hidden");

  document.getElementById("signupForm").classList.remove("hidden");

  document.getElementById("closeAuth").style.display = "block";

  document.getElementById("authTitle").style.display = "block";
}
// RESEND OTP
function resendOTP() {
  console.log("Resending OTP...");

  // reuse signup phone
  const phoneInput = document.getElementById("signupPhone").value;
  const phone = validatePhone(phoneInput);

  fetch(BASE_URL + "/send_otp.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone })
  })
  .then(res => res.json())
  .then(data => {
    console.log("RESEND OTP:", data);
    alert("OTP resent successfully!");
  })
  .catch(err => {
    console.error(err);
  });
}

document.addEventListener("DOMContentLoaded", () => {

  // 🔥 ONLY RUN HOMEPAGE CODE IF HOME ELEMENT EXISTS
  if (!document.getElementById("signupForm")) return;

  // homepage logic here...
});
// ===============================
// SUBCITY → AREA (FIXED)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const areas = {
    bole: ["Gerji", "CMC"],
    yeka: ["Megenagna"],
    kirkos: ["Kazanchis"]
  };

  const subcity = document.getElementById("subcity");
  const area = document.getElementById("area");

  if (!subcity || !area) return;

  subcity.addEventListener("change", () => {

    area.innerHTML = `<option value="">Select Area</option>`;

    const selected = subcity.value;

    if (!areas[selected]) return;

    areas[selected].forEach(a => {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      area.appendChild(opt);
    });

  });

});

// ==============================
// WELCOME PAGE INIT
// ==============================
document.addEventListener("DOMContentLoaded", () => {

  // ONLY RUN ON welcome.html
  if (!document.getElementById("welcomePage")) return;

  console.log("WELCOME PAGE INIT");

  // render cards
  renderPopular();
  renderList(ustazData);

  // enable filters
  initFilters();

  // enable search
  initSearch();

});
 // ===============================
 // SECONDARY BUTTON HERE → SERVICE SECTION
 // ===============================
const viewFieldsBtn = document.getElementById("viewFieldsBtn");

if (viewFieldsBtn) {
  viewFieldsBtn.onclick = () => {
    document.getElementById("services").scrollIntoView({
      behavior: "smooth"
    });
  };
}
 
 // ===============================
 // NAV ACTIVE LINK (FIXED)
 // ===============================
 const navLinks = document.querySelectorAll(".nav a");

 function setActive(id) {
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + id) {
      link.classList.add("active");
    }
  });
 }

 // Click behavior (IMPORTANT FIX)
 navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").replace("#", "");
    setActive(id);
  });
 });

  // Scroll behavior (stable version)
 window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");

  let current = "home";

  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();

    if (rect.top <= 200 && rect.bottom >= 200) {
      current = sec.id;
    }
  });

  setActive(current);
 });
  // ==============================
  // BLOG PROTECTION (LOGIN REQUIRED)
  // ==============================
 document.querySelectorAll("#blog .card-link").forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();

    requireAuth(() => {
      // later you can open blog page or article
      console.log("Opening blog article...");
    });
  });
 });

  // ==============================
  // POPULAR HORIZONTAL SCROLL
 // ==============================
 function scrollPopular(direction) {
  const container = document.getElementById("popularList");

  if (!container) return;

  container.scrollBy({
    left: direction * 200,
    behavior: "smooth"
  });
 }  

 function testOTP() {
  fetch("http://localhost/BarakaLink/backend/send_otp.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone: "912345678"
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("TEST RESULT:", data);
  });
}

// =========================
// SIDE MENU
// =========================

function openSideMenu() {
  document.getElementById("sideMenu").classList.add("show");
  document.getElementById("overlay").classList.add("show");
}

function closeSideMenu() {
  document.getElementById("sideMenu").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
}
function logout() {
  // clear login/session data (if you use it later)
  localStorage.clear();

  // optional: show message
  alert("Logged out successfully");

  // redirect to login page
  window.location.href = "index.html"; // change if your login page is different
}
// ===============================
// GLOBAL STEP CONTROL (UI)
// ===============================
let currentStep = 1;

function nextStep() {
  currentStep++;
  updateUI();
}

function updateUI() {
  const menu = document.getElementById("menuIcon");
  const profile = document.getElementById("profileIcon");

  if (!menu || !profile) return;

  // hide UI until final step
  if (currentStep < 5) {
    menu.classList.add("hidden-ui");
    profile.classList.add("hidden-ui");
  } else {
    menu.classList.remove("hidden-ui");
    profile.classList.remove("hidden-ui");
  }
}

window.onload = function () {
  updateUI();
};


// ===============================
// USTAZ PROFILE COMPLETION
// ===============================
function completeProfile() {

  const user = JSON.parse(localStorage.getItem("tempUser"));
  const role = localStorage.getItem("tempRole");

  const bio = document.getElementById("bio")?.value || "";

  // collect selected study fields
  const subjects = Array.from(
    document.querySelectorAll(".checkbox-group input[type='checkbox']:checked")
  ).map(cb => cb.parentElement.innerText.trim());

  const languages = document.querySelector("input[placeholder*='Arabic']")?.value || "";

  const profileData = {
    ...user,
    role,
    bio,
    subjects,
    languages
  };

  console.log("USTAZ PROFILE SAVED:", profileData);

  // TODO: send to backend (PHP/MySQL later)

  // cleanup temp storage
  localStorage.removeItem("tempRole");
  localStorage.removeItem("tempUser");

  // reset UI step (optional safety)
  currentStep = 5;
  updateUI();

  // redirect based on role
  if (role === "ustaz") {
    window.location.href = "ustaz-dashboard.html";
  } else {
    window.location.href = "welcome.html";
  }
}


// ===============================
// SIDE MENU (WORKING GLOBAL)
// ===============================
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  if (!menu || !overlay) return;

  menu.classList.toggle("show");
  overlay.classList.toggle("show");
}


// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
// ===============================
// LOAD USTAZ DASHBOARD DATA
// ===============================
window.addEventListener("DOMContentLoaded", () => {

  const role = localStorage.getItem("tempRole");

  if (role === "ustaz") {
    const user = JSON.parse(localStorage.getItem("tempUser"));

    if (!user) return;

    document.getElementById("ustazName").innerText =
      user.firstName + " " + user.lastName;

    document.getElementById("ustazBio").innerText =
      user.bio || "No bio yet";

    // subjects
    const container = document.getElementById("ustazSubjects");

    if (user.subjects && container) {
      container.innerHTML = user.subjects
        .map(s => `<span>${s}</span>`)
        .join("");
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initTheme();
});
