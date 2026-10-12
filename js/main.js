// ---------- Dark mode (remembered using localStorage) ----------
const themeToggle = document.getElementById("theme-toggle");

// On page load: if the user chose dark earlier, apply it
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        // Save the current choice
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
}

// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        // toggle returns true if the class was just added
        const isOpen = navLinks.classList.toggle("open");

        // Update the accessibility state and swap the icon (bars <-> X)
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });
}

// ---------- Login status in the navbar ----------
// The logged-in user is saved as { name, email } under "currentUser"
const navActions = document.querySelector(".nav-actions");

if (navActions) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const authBox = document.createElement("div");
    authBox.className = "auth-box";

    if (currentUser) {
        authBox.innerHTML = `
            <span class="auth-name"><i class="fa-solid fa-user"></i> ${currentUser.name}</span>
            <button id="logout-btn" class="logout-btn">Logout</button>`;
    } else {
        authBox.innerHTML = `<a class="auth-link" href="login.html">Login</a>`;
    }

    // Put it first inside the nav-actions box
    navActions.prepend(authBox);

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }
}