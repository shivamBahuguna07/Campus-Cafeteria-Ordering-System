// ---------- 1. MENU DATA ----------
// Each item has: id, name, category, price, veg (true/false), available (true/false)
var menu = [
  // Breakfast
  { id: 1,  name: "Aloo Paratha",   category: "Breakfast", price: 30, veg: true,  available: true,  emoji: "🫓" },
  { id: 2,  name: "Poha",           category: "Breakfast", price: 20, veg: true,  available: true,  emoji: "🍚" },
  { id: 3,  name: "Bread Omelette", category: "Breakfast", price: 35, veg: false, available: true,  emoji: "🍳" },
  { id: 4,  name: "Idli Sambar",    category: "Breakfast", price: 30, veg: true,  available: false, emoji: "🥣" },

  // Lunch
  { id: 5,  name: "Rajma Chawal",   category: "Lunch",     price: 60, veg: true,  available: true,  emoji: "🍛" },
  { id: 6,  name: "Chole Bhature",  category: "Lunch",     price: 55, veg: true,  available: true,  emoji: "🥘" },
  { id: 7,  name: "Chicken Biryani",category: "Lunch",     price: 90, veg: false, available: true,  emoji: "🍗" },
  { id: 8,  name: "Paneer Thali",   category: "Lunch",     price: 80, veg: true,  available: false, emoji: "🍽️" },

  // Snacks
  { id: 9,  name: "Samosa",         category: "Snacks",    price: 15, veg: true,  available: true,  emoji: "🥟" },
  { id: 10, name: "Veg Burger",     category: "Snacks",    price: 40, veg: true,  available: true,  emoji: "🍔" },
  { id: 11, name: "Chicken Roll",   category: "Snacks",    price: 50, veg: false, available: true,  emoji: "🌯" },
  { id: 12, name: "French Fries",   category: "Snacks",    price: 35, veg: true,  available: true,  emoji: "🍟" },

  // Beverages
  { id: 13, name: "Masala Chai",    category: "Beverages", price: 10, veg: true,  available: true,  emoji: "☕" },
  { id: 14, name: "Cold Coffee",    category: "Beverages", price: 40, veg: true,  available: true,  emoji: "🥤" },
  { id: 15, name: "Lemon Soda",     category: "Beverages", price: 25, veg: true,  available: false, emoji: "🍋" },
  { id: 16, name: "Mango Shake",    category: "Beverages", price: 45, veg: true,  available: true,  emoji: "🥭" }
];

// ---------- 2. CART ----------
// Cart is an array. Each element: { id: 1, qty: 2 }
var cart = [];
var TAX_RATE = 0.05; // 5% tax


// ---------- 3. SHOW MENU CARDS ----------
function showMenu(category, btn) {
  var grid = document.getElementById("menuGrid");
  grid.innerHTML = ""; // clear old cards

  // change active filter button colour
  if (btn) {
    var allButtons = document.getElementsByClassName("filter-btn");
    for (var i = 0; i < allButtons.length; i++) {
      allButtons[i].classList.remove("active");
    }
    btn.classList.add("active");
  }

  // go through every item and make a card
  for (var i = 0; i < menu.length; i++) {
    var item = menu[i];

    // show only the selected category (or all)
    if (category != "All" && item.category != category) {
      continue;
    }

    // veg or non-veg dot
    var dotClass = item.veg ? "dot" : "dot nonveg";

    // in stock or sold out badge
    var badge = "";
    var disabled = "";
    if (item.available) {
      badge = '<span class="badge in-stock">In Stock</span>';
    } else {
      badge = '<span class="badge sold-out">Sold Out</span>';
      disabled = "disabled";
    }

    grid.innerHTML +=
      '<div class="card">' +
        '<div class="emoji">' + item.emoji + '</div>' +
        '<h3><span class="' + dotClass + '"></span> ' + item.name + '</h3>' +
        '<p class="category">' + item.category + '</p>' +
        '<p class="price">₹' + item.price + '</p>' +
        badge +
        '<button class="add-btn" ' + disabled + ' onclick="addToCart(' + item.id + ')">Add to Cart</button>' +
      '</div>';
  }
}


// ---------- 4. ADD TO CART ----------
function addToCart(id) {
  // if item already in cart, just increase quantity
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + 1;
      showCart();
      return;
    }
  }
  // otherwise add as new item
  cart.push({ id: id, qty: 1 });
  showCart();
}


// ---------- 5. CHANGE QUANTITY (+ or -) ----------
function changeQty(id, change) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + change;

      // if quantity becomes 0, remove the item
      if (cart[i].qty <= 0) {
        cart.splice(i, 1);
      }
      break;
    }
  }
  showCart();
}


// find an item in the menu using its id
function getItem(id) {
  for (var i = 0; i < menu.length; i++) {
    if (menu[i].id == id) {
      return menu[i];
    }
  }
}


// ---------- 6. SHOW CART AND CALCULATE BILL ----------
function showCart() {
  var cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = "";

  var subtotal = 0;

  if (cart.length == 0) {
    cartDiv.innerHTML = '<p class="empty-text">Your cart is empty.</p>';
  }

  for (var i = 0; i < cart.length; i++) {
    var item = getItem(cart[i].id);
    var itemTotal = item.price * cart[i].qty;
    subtotal = subtotal + itemTotal;

    cartDiv.innerHTML +=
      '<div class="cart-item">' +
        '<span>' + item.name + '<br>₹' + item.price + ' x ' + cart[i].qty + '</span>' +
        '<span>' +
          '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">-</button> ' +
          cart[i].qty +
          ' <button class="qty-btn" onclick="changeQty(' + item.id + ', 1)">+</button>' +
        '</span>' +
        '<span>₹' + itemTotal + '</span>' +
      '</div>';
  }

  // bill calculation
  var tax = subtotal * TAX_RATE;
  var total = subtotal + tax;

  document.getElementById("subtotal").innerText = "₹" + subtotal.toFixed(2);
  document.getElementById("tax").innerText = "₹" + tax.toFixed(2);
  document.getElementById("total").innerText = "₹" + total.toFixed(2);
}


// ---------- 7. PLACE ORDER ----------
function placeOrder() {
  // check cart is not empty
  if (cart.length == 0) {
    alert("Please add some items to the cart first!");
    return;
  }

  // check time slot is selected
  var slot = document.getElementById("slot").value;
  if (slot == "") {
    alert("Please select a pickup time slot!");
    return;
  }

  // make a random order token like TKN-452
  var token = "TKN-" + (Math.floor(Math.random() * 900) + 100);
  var totalAmount = document.getElementById("total").innerText;

  document.getElementById("tokenBox").innerHTML =
    '<p>✅ Order Placed Successfully!</p>' +
    '<p>Your Order Token:</p>' +
    '<div class="token">' + token + '</div>' +
    '<p>Pickup: ' + slot + '</p>' +
    '<p>Amount to pay: ' + totalAmount + '</p>';

  // empty the cart after order
  cart = [];
  document.getElementById("slot").value = "";
  showCart();
}


// ---------- 8. RUN WHEN PAGE LOADS ----------
showMenu("All", null);
showCart();