// ---------- Cart storage ----------
// The cart is an array of objects: { id, name, price, image, qty }

function getCart() {
    // localStorage only stores text, so we convert the text back into an array
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Number shown on the cart icon in the navbar
function updateCartCount() {
    const count = getCart().reduce(function (sum, item) {
        return sum + item.qty;
    }, 0);

    const badge = document.getElementById("cart-count");
    if (badge) {
        badge.textContent = count;
    }
}

function addToCart(dish) {
    const cart = getCart();

    // Is this dish already in the cart?
    const existing = cart.find(function (item) {
        return item.id === dish.id;
    });

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            qty: 1
        });
    }

    saveCart(cart);
}

// ---------- Add to cart buttons (Home page and Menu page) ----------
// One listener on the whole page. It works even for cards JavaScript creates later.
document.addEventListener("click", function (event) {
    const button = event.target.closest(".add-btn");
    if (!button) return;

    addToCart({
        id: Number(button.dataset.id),
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image
    });

    // Go to the cart page
    window.location.href = "cart.html";
});

// ---------- Cart page ----------
const cartItems = document.getElementById("cart-items");

if (cartItems) {
    const cartTotal = document.getElementById("cart-total");
    const cartSummary = document.getElementById("cart-summary");
    const orderMessage = document.getElementById("order-message");
    const confirmation = document.getElementById("order-confirmation");

    function getTotal(cart) {
        return cart.reduce(function (sum, item) {
            return sum + item.price * item.qty;
        }, 0);
    }

    function renderCart() {
        const cart = getCart();

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty.</p>
                    <a class="btn" href="menu.html">Browse the menu</a>
                </div>`;
            cartTotal.textContent = "₹0";
            return;
        }

        cartItems.innerHTML = cart.map(function (item) {
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-info">
                        <h3>${item.name}</h3>
                        <p class="price">₹${item.price}</p>
                    </div>
                    <div class="qty-controls">
                        <button data-action="minus" data-id="${item.id}">-</button>
                        <span>${item.qty}</span>
                        <button data-action="plus" data-id="${item.id}">+</button>
                    </div>
                    <p class="item-total">₹${item.price * item.qty}</p>
                    <button class="remove-btn" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>`;
        }).join("");

        cartTotal.textContent = "₹" + getTotal(cart);
    }

    // Clicks on + , - and remove
    cartItems.addEventListener("click", function (event) {
        const button = event.target.closest("button");
        if (!button) return;

        const id = Number(button.dataset.id);
        const action = button.dataset.action;
        let cart = getCart();
        const item = cart.find(function (i) { return i.id === id; });

        if (action === "plus") {
            item.qty++;
        }
        if (action === "minus") {
            item.qty--;
            if (item.qty <= 0) {
                cart = cart.filter(function (i) { return i.id !== id; });
            }
        }
        if (action === "remove") {
            cart = cart.filter(function (i) { return i.id !== id; });
        }

        saveCart(cart);
        orderMessage.textContent = "";
        renderCart();
        updateCartCount();
    });

    document.getElementById("clear-cart").addEventListener("click", function () {
        saveCart([]);
        orderMessage.textContent = "";
        renderCart();
        updateCartCount();
    });

    // ---------- Place order ----------
      document.getElementById("place-order").addEventListener("click", function () {
        const cart = getCart();

        // Only logged-in users can order
        if (!localStorage.getItem("currentUser")) {
            orderMessage.innerHTML = 'Please <a href="login.html"><u>log in</u></a> or <a href="signup.html"><u>sign up</u></a> to place your order.';
            return;
        }

        // Nothing to order
        if (cart.length === 0) {
            orderMessage.textContent = "Your cart is empty. Please add some dishes first.";
            return;
        }

        const total = getTotal(cart);
        const orderNumber = "TB" + Date.now().toString().slice(-6);   // e.g. TB482913

        // Show the confirmation (before we clear the cart, so the numbers are correct)
        confirmation.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <h2>Thank you! Your order is placed.</h2>
            <p>Order number: <strong>${orderNumber}</strong></p>
            <p>Total: <strong>₹${total}</strong></p>
            <p>Our kitchen is preparing your food.</p>
            <a class="btn" href="menu.html">Order more</a>
        `;

        // Empty the cart and swap what is shown on the page
        saveCart([]);
        updateCartCount();
        cartItems.hidden = true;
        cartSummary.hidden = true;
        confirmation.hidden = false;
    });

    renderCart();
}

// Show the correct number on the cart icon when any page loads
updateCartCount();