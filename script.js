// Data: Menu Items
const menuData = [
  {
    category: "1️⃣ Classic Ice Cream",
    image: "assets/category_classic.png",
    items: [
      { id: 'c1', name: "Vanilla Delight", price: 5.00 },
      { id: 'c2', name: "Chocolate Heaven", price: 5.50 },
      { id: 'c3', name: "Strawberry Bliss", price: 5.00 },
      { id: 'c4', name: "Butterscotch Crunch", price: 6.00 }
    ]
  },
  {
    category: "2️⃣ Fruit Ice Cream",
    image: "assets/category_fruit.png",
    items: [
      { id: 'f1', name: "Mango Magic", price: 6.50 },
      { id: 'f2', name: "Sitaphal Special", price: 7.00 },
      { id: 'f3', name: "Pineapple Punch", price: 6.00 },
      { id: 'f4', name: "Black Currant Burst", price: 6.50 }
    ]
  },
  {
    category: "3️⃣ Premium / Dry Fruit Ice Cream",
    image: "assets/category_premium.png",
    items: [
      { id: 'p1', name: "Almond Royale", price: 8.00 },
      { id: 'p2', name: "Pistachio Cream", price: 8.50 },
      { id: 'p3', name: "Cashew Caramel", price: 8.00 },
      { id: 'p4', name: "Honey Walnut", price: 8.50 }
    ]
  },
  {
    category: "4️⃣ Chocolate Lovers Ice Cream",
    image: "assets/category_chocolate.png",
    items: [
      { id: 'ch1', name: "Dark Chocolate Truffle", price: 7.50 },
      { id: 'ch2', name: "Chocolate Chip", price: 6.50 },
      { id: 'ch3', name: "Chocolate Fudge Brownie", price: 8.50 },
      { id: 'ch4', name: "Choco Oreo Crunch", price: 7.50 }
    ]
  }
];

// App State
let cart = [];

// DOM Elements
const loginOverlay = document.getElementById('login-overlay');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-section');
const menuList = document.querySelector('.menu-list');

// Cart DOM
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartModal = document.getElementById('cart-modal');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const orderBtn = document.getElementById('order-btn');

// Payment Modal
const paymentModal = document.getElementById('payment-modal');
const cancelOrderBtn = document.getElementById('cancel-order-btn');
const payBtns = document.querySelectorAll('.pay-btn');
const toastMsg = document.getElementById('toast-message');

// Initialize App
function init() {
  renderMenu();
  setupEventListeners();
}

// 1. Login Validation
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  const nameError = document.getElementById('name-error');
  const phoneError = document.getElementById('phone-error');
  
  let valid = true;

  if (name.length <= 2) {
    nameError.style.display = 'block';
    valid = false;
  } else {
    nameError.style.display = 'none';
  }

  // Check exactly 10 digits
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    phoneError.style.display = 'block';
    valid = false;
  } else {
    phoneError.style.display = 'none';
  }

  if (valid) {
    // Transition to main app
    loginOverlay.classList.remove('active');
    setTimeout(() => {
      loginOverlay.classList.add('hidden');
      mainApp.classList.remove('hidden');
    }, 300); // fade transition match
  }
});

// 2. Navigation
navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    // remove active class from all buttons
    navItems.forEach(b => b.classList.remove('active'));
    // add to clicked
    btn.classList.add('active');
    
    // switch views
    const target = btn.getAttribute('data-target');
    views.forEach(v => {
      v.classList.remove('active');
      v.classList.add('hidden');
    });
    const activeView = document.getElementById(target);
    activeView.classList.remove('hidden');
    
    // trigger reflow for animation
    void activeView.offsetWidth; 
    activeView.classList.add('active');
  });
});

// 3. Render Menu
function renderMenu() {
  menuList.innerHTML = '';
  
  menuData.forEach((category, index) => {
    // Create Accordion Container
    const accordion = document.createElement('div');
    accordion.className = 'accordion-item';
    
    // Header
    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.innerHTML = `
      <div class="accordion-title">
        <span>${category.category}</span>
      </div>
      <div class="accordion-icon">🔻</div>
    `;
    
    // Body
    const body = document.createElement('div');
    body.className = 'accordion-body';
    
    // Grid inside body
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    
    // Populate Items
    category.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${category.image}" alt="${item.name}" class="product-img" onerror="this.src='https://via.placeholder.com/300x200?text=Ice+Cream'">
        <div class="product-info">
          <div>
            <h4 class="product-name">${item.name}</h4>
            <div class="product-price">$${item.price.toFixed(2)}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary btn-small w-100" onclick="addToCart('${item.id}', '${category.category}')">Add to Cart</button>
            <button class="btn-primary btn-small w-100" onclick="buyNow('${item.id}', '${category.category}')">Buy</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    
    body.appendChild(grid);
    accordion.appendChild(header);
    accordion.appendChild(body);
    
    // Accordion Toggle Logic
    header.addEventListener('click', () => {
      const isActive = accordion.classList.contains('active');
      // close all others
      document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('active'));
      // toggle current
      if (!isActive) accordion.classList.add('active');
    });
    
    menuList.appendChild(accordion);
  });
}

// 4. Cart Logic
window.addToCart = function(itemId, categoryName) {
  // Find item
  let product = null;
  menuData.forEach(cat => {
    const found = cat.items.find(i => i.id === itemId);
    if (found) product = found;
  });

  if (product) {
    cart.push({ ...product, cartId: Date.now() });
    updateCartUI();
    showToast(`Added ${product.name} to cart`, 'success');
  }
}

window.buyNow = function(itemId, categoryName) {
  addToCart(itemId, categoryName);
  cartModal.classList.add('active');
}

window.removeFromCart = function(cartId) {
  cart = cart.filter(item => item.cartId !== cartId);
  updateCartUI();
}

function updateCartUI() {
  // update count
  cartCount.innerText = cart.length;
  
  // update modal list
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    orderBtn.classList.add('hidden');
    cartTotalPrice.innerText = '$0.00';
    return;
  }
  
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.cartId})">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
  });
  
  cartTotalPrice.innerText = '$' + total.toFixed(2);
  orderBtn.classList.remove('hidden');
}

// 5. Checkout / Payment Flow
function setupEventListeners() {
  cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
  closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));
  
  orderBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
    paymentModal.classList.add('active');
  });
  
  cancelOrderBtn.addEventListener('click', () => {
    paymentModal.classList.remove('active');
    showToast('Order cancelled', 'error');
  });
  
  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Simulate processing
      paymentModal.classList.remove('active');
      showToast('Order Confirmed! Serving up soon 🍦', 'success');
      // clear cart
      cart = [];
      updateCartUI();
    });
  });
}

// Toast Utility
function showToast(msg, type = 'success') {
  toastMsg.innerText = msg;
  toastMsg.className = `toast show ${type}`;
  setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 3000);
}

// Start
document.addEventListener('DOMContentLoaded', init);
