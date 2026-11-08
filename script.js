// Easger Duckins storefront — edit the products array below to update your collection.
const STORE_EMAIL = "essammazen357@gmail.com";

const products = [
  { id: 1, name: "Classic Duck Hoodie", category: "hoodies", price: 400, oldPrice: 1050, tag: "BEST SELLER", emoji: "🧥", art: "#f5d66c", image: "images/classic-duck-hoodie.jpeg" },
  { id: 2, name: "Midnight Oversized Hoodie", category: "hoodies", price: 920, tag: "NEW DROP", emoji: "🧥", art: "#b7c4b5" },
  { id: 3, name: "Quack Club Hoodie", category: "hoodies", price: 790, oldPrice: 950, tag: "SALE", emoji: "🧥", art: "#f1b59b" },
  { id: 4, name: "Golden Beak Hoodie", category: "hoodies", price: 880, tag: "LIMITED", emoji: "🧥", art: "#f4c84b" },
  { id: 5, name: "Everyday Cargo Pants", category: "pants", price: 780, tag: "POPULAR", emoji: "👖", art: "#c8d2a7" },
  { id: 6, name: "Relaxed Fit Joggers", category: "pants", price: 650, oldPrice: 800, tag: "SALE", emoji: "👖", art: "#c6c2d9" },
  { id: 7, name: "Duck Street Pants", category: "pants", price: 820, tag: "NEW DROP", emoji: "👖", art: "#e7c28f" },
  { id: 8, name: "Daily Comfort Pants", category: "pants", price: 590, oldPrice: 720, tag: "SALE", emoji: "👖", art: "#b7cbd7" },
  { id: 9, name: "Campus Duck Hoodie", category: "hoodies", price: 890, tag: "FLOCK PICK", emoji: "🧥", art: "#d8c1a7" },
  { id: 10, name: "Weekend Wide Pants", category: "pants", price: 740, tag: "EASY FIT", emoji: "👖", art: "#c7d1ce" },
  { id: 11, name: "Quack Attack Hoodie", category: "hoodies", price: 950, oldPrice: 1100, tag: "OFFER", emoji: "🧥", art: "#e8b9c0" },
  { id: 12, name: "Street Utility Pants", category: "pants", price: 860, tag: "NEW", emoji: "👖", art: "#d6c79d" }
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["Black", "White", "Yellow", "Grey", "Navy", "Olive", "Beige", "Brown"];
let cart = [];

const money = value => `${value.toLocaleString("en-US")} EGP`;
const productGrid = document.getElementById("product-grid");
const cartDrawer = document.getElementById("cart-drawer");
const backdrop = document.getElementById("drawer-backdrop");
const cartItems = document.getElementById("cart-items");
const toast = document.getElementById("toast");

function renderProducts(category = "all") {
  const visible = products.filter(product => {
    if (category === "all") return true;
    if (category === "offers") return Boolean(product.oldPrice);
    return product.category === category;
  });

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-art" style="--art:${product.art}">
        <span class="product-tag">${product.tag || "DUCKINS"}</span>
        ${product.image ? `<img class="product-photo" src="${product.image}" alt="${product.name}">` : `<span class="product-emoji">${product.emoji}</span>`}
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-category">${product.category.toUpperCase()} · EASGER DUCKINS</div>
        <span class="product-price">${money(product.price)}</span>
        ${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ""}
        <button class="add-button" type="button" data-add="${product.id}">ADD TO BAG +</button>
      </div>
    </article>
  `).join("");
}

document.querySelectorAll(".category-tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-tab").forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.category);
  });
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find(item => item.id === Number(button.dataset.add));
  if (!product) return;
  cart.push({ ...product, lineId: `${Date.now()}-${Math.random()}`, size: "", color: "" });
  renderCart();
  showToast("Added to your Duck Bag!");
});

function renderCart() {
  document.getElementById("cart-count").textContent = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("subtotal").textContent = money(total);

  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart"><span>🦆</span><p>Your bag is empty.<br>Let's find you a fresh fit!</p></div>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-line">
      <div>
        <h3>${item.name}</h3>
        <div class="cart-line-price">${money(item.price)}</div>
        <div class="cart-line-controls">
          <select aria-label="Size for ${item.name}" data-field="size" data-line="${item.lineId}">
            <option value="">Choose size</option>
            ${sizes.map(size => `<option value="${size}" ${item.size === size ? "selected" : ""}>${size}</option>`).join("")}
          </select>
          <select aria-label="Color for ${item.name}" data-field="color" data-line="${item.lineId}">
            <option value="">Choose color</option>
            ${colors.map(color => `<option value="${color}" ${item.color === color ? "selected" : ""}>${color}</option>`).join("")}
          </select>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove="${item.lineId}">REMOVE</button>
    </div>
  `).join("");
}

cartItems.addEventListener("change", event => {
  const select = event.target.closest("select[data-field]");
  if (!select) return;
  const item = cart.find(entry => entry.lineId === select.dataset.line);
  if (item) item[select.dataset.field] = select.value;
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  cart = cart.filter(item => item.lineId !== button.dataset.remove);
  renderCart();
});

function openCart() {
  cartDrawer.classList.add("open");
  backdrop.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  backdrop.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.getElementById("order-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("form-status");
  const button = document.getElementById("submit-order");

  const showStatus = (message, kind = "") => {
    status.textContent = message;
    status.dataset.state = kind;
  };

  if (!cart.length) {
    showStatus("Your bag is empty. Add a product first.", "error");
    return;
  }

  const incomplete = cart.find(item => !item.size || !item.color);
  if (incomplete) {
    showStatus(`Please choose a size and color for ${incomplete.name}.`, "error");
    return;
  }

  const orderLines = cart.map((item, index) =>
    `${index + 1}. ${item.name} | ${money(item.price)} | Size: ${item.size} | Color: ${item.color}`
  );
  const orderDetails = `${orderLines.join("\n")}\n\nSubtotal: ${money(cart.reduce((sum, item) => sum + item.price, 0))}`;
  document.getElementById("order-details").value = orderDetails;

  button.disabled = true;
  button.textContent = "SENDING ORDER...";
  showStatus("Sending your order...", "loading");

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${STORE_EMAIL}`, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });

    let result;
    try {
      result = await response.json();
    } catch (_) {
      throw new Error("The email service returned an unreadable response.");
    }

    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error(result.message || `Email service error (${response.status}).`);
    }

    showStatus("Your order was sent successfully! We'll contact you soon. 🦆", "success");
    showToast("Your order was submitted!");
    cart = [];
    renderCart();
    form.reset();
  } catch (error) {
    console.error("Easger Duckins order error:", error);
    showStatus(
      "We couldn't confirm that your order was sent. Check your internet connection and make sure the store email has been activated with FormSubmit, then try again.",
      "error"
    );
  } finally {
    button.disabled = false;
    button.textContent = "SUBMIT ORDER ↗";
  }
});

renderProducts();
renderCart();
