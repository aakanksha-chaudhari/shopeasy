// ---------- Select elements ----------
const form = document.getElementById("booking-form");
const message = document.getElementById("form-message");
const dateInput = document.getElementById("date");

// Earliest date allowed = today (blocks past dates in the date picker)
const today = new Date().toISOString().split("T")[0];
dateInput.min = today;

// ---------- Show or clear an error under one field ----------
// Returns true if the field is OK (no error text)
function setError(field, text) {
    const errorBox = field.parentElement.querySelector(".error-text");
    errorBox.textContent = text;
    field.classList.toggle("invalid", text !== "");
    return text === "";
}

// ---------- One small function per field ----------
function checkName() {
    const value = form.name.value.trim();
    if (value.length < 2) {
        return setError(form.name, "Please enter your name (at least 2 letters).");
    }
    return setError(form.name, "");
}

function checkEmail() {
    const value = form.email.value.trim();
    const pattern = /^\S+@\S+\.\S+$/;     // something@something.something
    if (!pattern.test(value)) {
        return setError(form.email, "Please enter a valid email address.");
    }
    return setError(form.email, "");
}

function checkPhone() {
    const value = form.phone.value.trim();
    const pattern = /^[6-9]\d{9}$/;       // 10 digits, starting with 6, 7, 8 or 9
    if (!pattern.test(value)) {
        return setError(form.phone, "Enter a valid 10-digit mobile number.");
    }
    return setError(form.phone, "");
}

function checkDate() {
    const value = form.date.value;
    if (value === "") {
        return setError(form.date, "Please choose a date.");
    }
    if (value < today) {
        return setError(form.date, "The date cannot be in the past.");
    }
    return setError(form.date, "");
}

function checkGuests() {
    if (form.guests.value === "") {
        return setError(form.guests, "Please choose the number of guests.");
    }
    return setError(form.guests, "");
}

// ---------- Submit ----------
form.addEventListener("submit", function (event) {
    event.preventDefault();               // stop the page from reloading

    // Run every check. We store all results first so every error shows at once.
    const results = [
        checkName(),
        checkEmail(),
        checkPhone(),
        checkDate(),
        checkGuests()
    ];

    const allValid = results.every(function (ok) {
        return ok === true;
    });

    if (allValid) {
        message.textContent = "Thank you, " + form.name.value.trim() + "! Your table is booked.";
        message.className = "form-message success";
        form.reset();
    } else {
        message.textContent = "Please fix the errors above.";
        message.className = "form-message fail";
    }
});

// ---------- Check each field as soon as the user leaves it ----------
form.name.addEventListener("blur", checkName);
form.email.addEventListener("blur", checkEmail);
form.phone.addEventListener("blur", checkPhone);
form.date.addEventListener("blur", checkDate);
form.guests.addEventListener("blur", checkGuests);