// ---------- Helpers ----------
const message = document.getElementById("form-message");

// Show or clear an error under one field. Returns true if the field is OK.
function setError(field, text) {
    const errorBox = field.parentElement.querySelector(".error-text");
    errorBox.textContent = text;
    field.classList.toggle("invalid", text !== "");
    return text === "";
}

// Turn a password into a long scrambled string (SHA-256 hash).
// We store the hash, never the real password.
// "async/await" is a cleaner way to write Promises: await waits for the result.
async function hashPassword(password) {
    const bytes = new TextEncoder().encode(password);
    const buffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(buffer))
        .map(function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

const emailPattern = /^\S+@\S+\.\S+$/;

// ---------- SIGN UP ----------
const signupForm = document.getElementById("signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const f = signupForm;

        const name = f.name.value.trim();
        const email = f.email.value.trim().toLowerCase();
        const password = f.password.value;
        const confirm = f.confirm.value;

        // Check every field (all errors appear at once)
        const checks = [
            setError(f.name, name.length < 2 ? "Please enter your name (at least 2 letters)." : ""),
            setError(f.email, !emailPattern.test(email) ? "Please enter a valid email address." : ""),
            setError(f.password, !/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)
                ? "Use at least 6 characters, with a letter and a number." : ""),
            setError(f.confirm, confirm !== password ? "Passwords do not match." : "")
        ];

        if (!checks.every(Boolean)) {
            message.textContent = "Please fix the errors above.";
            message.className = "form-message fail";
            return;
        }

        const users = getUsers();

        // Is this email already registered?
        const exists = users.some(function (u) { return u.email === email; });
        if (exists) {
            setError(f.email, "An account with this email already exists.");
            message.textContent = "Please log in instead.";
            message.className = "form-message fail";
            return;
        }

        // Save the new user with a hashed password
        users.push({ name: name, email: email, passwordHash: await hashPassword(password) });
        saveUsers(users);

        // Log them in straight away
        localStorage.setItem("currentUser", JSON.stringify({ name: name, email: email }));
        message.textContent = "Account created! Taking you to the menu...";
        message.className = "form-message success";

        setTimeout(function () {
            window.location.href = "menu.html";
        }, 1000);
    });
}

// ---------- LOG IN ----------
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const f = loginForm;

        const email = f.email.value.trim().toLowerCase();
        const password = f.password.value;

        const checks = [
            setError(f.email, !emailPattern.test(email) ? "Please enter a valid email address." : ""),
            setError(f.password, password === "" ? "Please enter your password." : "")
        ];

        if (!checks.every(Boolean)) {
            message.textContent = "";
            return;
        }

        // Find the user with this email, then compare the hashed passwords
        const user = getUsers().find(function (u) { return u.email === email; });
        const hash = await hashPassword(password);

        if (!user || user.passwordHash !== hash) {
            // Same message for both cases, so we don't reveal which emails exist
            message.textContent = "Incorrect email or password.";
            message.className = "form-message fail";
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email: user.email }));
        message.textContent = "Welcome back, " + user.name + "!";
        message.className = "form-message success";

        setTimeout(function () {
            window.location.href = "menu.html";
        }, 800);
    });
}