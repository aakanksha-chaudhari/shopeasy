// ---------- Select elements ----------
const menuGrid = document.getElementById("menu-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

// All dishes from menu.json are kept here, so we can filter them again and again
let allDishes = [];

// ---------- Create the cards ----------
// Takes an array of dishes and puts one card on the page for each
function renderDishes(dishes) {
    if (dishes.length === 0) {
        menuGrid.innerHTML = "<p>No dishes found in this category.</p>";
        return;
    }

    const cards = dishes.map(function (dish) {
        return `
            <article class="dish-card">
                <div class="dish-image">
                    <img src="${dish.image}" alt="${dish.name}">
                    <span class="dish-tag">${dish.category}</span>
                </div>
                <div class="dish-body">
                    <h3>${dish.name}</h3>
                    <p class="dish-desc">${dish.description}</p>
                    <p class="price">₹${dish.price}</p>
                    <button class="add-btn" data-id="${dish.id}" data-name="${dish.name}" data-price="${dish.price}" data-image="${dish.image}">Add to cart</button>
                </div>
            </article>
        `;
    });

    menuGrid.innerHTML = cards.join("");
}

// ---------- Filter by category ----------
function filterDishes(category) {
    if (category === "All") {
        renderDishes(allDishes);
    } else {
        const filtered = allDishes.filter(function (dish) {
            return dish.category === category;
        });
        renderDishes(filtered);
    }
}

// ---------- Filter button clicks ----------
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        // Move the "active" class to the button that was clicked
        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });
        button.classList.add("active");

        // Show only the dishes of that category
        filterDishes(button.dataset.category);
    });
});

// ---------- Load the data ----------
fetch("data/menu.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (dishes) {
        allDishes = dishes;     // save the full list

        // Did the user come from a Home page category card?
        // Example: menu.html?category=Chinese
        const params = new URLSearchParams(window.location.search);
        const chosen = params.get("category") || "All";

        // Highlight the matching button, then show only that category
        filterButtons.forEach(function (btn) {
            btn.classList.toggle("active", btn.dataset.category === chosen);
        });
        filterDishes(chosen);
    })
    .catch(function (error) {
        menuGrid.innerHTML = "<p>Sorry, the menu could not be loaded.</p>";
        console.log("Error:", error);
    });