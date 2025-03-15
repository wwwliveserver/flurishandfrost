document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");
  const logo = document.getElementById("logo");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
      logo.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
      logo.classList.remove("scrolled");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleList = document.getElementById("toggleList");
  const clickableList = document.getElementById("clickableList");
  const closeButton = document.querySelector(".close-button");

  // Toggle dropdown when clicking "Categories"
  toggleList.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent link from reloading page

    // Get position of "Categories" button
    const rect = toggleList.getBoundingClientRect();
    clickableList.style.top = `${rect.bottom + window.scrollY}px`; // Position below the button
    clickableList.style.left = `${rect.left + window.scrollX}px`; // Align with button
    clickableList.style.display =
      clickableList.style.display === "block" ? "none" : "block";
  });

  // Close dropdown when clicking the close button
  closeButton.addEventListener("click", function () {
    clickableList.style.display = "none";
  });

  // Hide dropdown when clicking outside of it
  document.addEventListener("click", function (event) {
    if (
      !toggleList.contains(event.target) &&
      !clickableList.contains(event.target)
    ) {
      clickableList.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const orderButtons = document.querySelectorAll(".order-btn");
  const closeButtons = document.querySelectorAll(".close-btn");

  orderButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Close any other open popups
      document.querySelectorAll(".popup").forEach((popup) => {
        popup.classList.remove("active");
      });

      // Find the clicked product's popup and image
      const product = this.closest(".product");
      const popup = product.querySelector(".popup");
      const productImage = product.querySelector("img");

      // Set dataset attributes correctly
      popup.dataset.product = this.dataset.product;
      popup.dataset.size = this.dataset.size;
      popup.dataset.price = this.dataset.price;
      popup.dataset.image = productImage.src;

      // Fill the popup with product details
      popup.querySelector(
        ".popup-title"
      ).innerText = `Order ${this.dataset.product}`;
      popup.querySelector(
        ".popup-size"
      ).innerText = `Size: ${this.dataset.size}`;
      popup.querySelector(
        ".popup-price"
      ).innerText = `Price: ₦${this.dataset.price}`;

      // Get the image's position
      const imageRect = productImage.getBoundingClientRect();
      const popupHeight = popup.offsetHeight;
      const popupWidth = popup.offsetWidth;
      const popupMargin = 15; // Space between image and popup

      // Adjust positioning based on screen size
      if (window.innerWidth <= 450) {
        popup.style.top = `${
          window.scrollY + imageRect.bottom + popupMargin
        }px`; // Below image
        popup.style.left = `${window.scrollX + imageRect.left}px`;
        popup.style.width = "90%"; // Full width for smaller screens
        popup.style.transform = "none"; // Align left
      } else {
        popup.style.top = `${
          window.scrollY + imageRect.top - popupHeight - popupMargin
        }px`; // Above image
        popup.style.left = `${
          window.scrollX + imageRect.left + imageRect.width / 2 - popupWidth / 2
        }px`;
        popup.style.transform = "translateX(0)"; // Center above the product image
      }

      // Show the popup
      popup.classList.add("active");
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".popup").classList.remove("active");
    });
  });

  // Close popup when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !event.target.classList.contains("order-btn") &&
      !event.target.closest(".popup")
    ) {
      document.querySelectorAll(".popup").forEach((popup) => {
        popup.classList.remove("active");
      });
    }
  });
});

// Add to cart and update counter
document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartCounter = document.getElementById("cart-counter");

  updateCartCount(); // Load cart count from localStorage on page load

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let popup = this.closest(".popup");
      let productName = popup.dataset.product; // Fix: Retrieve correct product name
      let size = popup.dataset.size; // Fix: Retrieve correct size
      let price = parseInt(popup.dataset.price);
      let quantity = parseInt(popup.querySelector(".quantity").value);
      let productImage = popup.dataset.image; // Retrieve product image

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      let existingItem = cart.find(
        (item) => item.name === productName && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          name: productName,
          size: size,
          price: price,
          quantity: quantity,
          image: productImage,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount(); // Update cart count display
      popup.classList.remove("active"); // Close popup after adding
    });
  });

  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCounter) {
      cartCounter.innerText = totalItems;
      cartCounter.style.display = totalItems > 0 ? "inline-block" : "none";
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  displayCart(); // Load cart items when the cart page opens
});

function displayCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItemsContainer = document.getElementById("cart-items");
  let cartTotalElement = document.getElementById("cart-total");
  let checkoutBtn = document.getElementById("checkout-btn");

  cartItemsContainer.innerHTML = ""; // Clear current items
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty !</p>";
    cartTotalElement.innerText = "Total: ₦0";
    checkoutBtn.disabled = true;
    return;
  }

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 100px; height: 100px; border-radius:12px; object-fit: cover;">
      <p>${item.quantity} x ${item.size} ${item.name} - ₦${itemTotal}</p>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalElement.innerText = `Total: ₦${total}`;
  checkoutBtn.disabled = false;
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
}

function checkout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty! Please add some items before checking out.");
    return;
  }
  let message = "Hello, I'd like to place an order for:\n";
  let totalPrice = 0;
  cart.forEach((item) => {
    let itemTotal = item.price * item.quantity;
    message += `${item.quantity} x ${item.size} ${item.name} - ₦${itemTotal}\n`;
    totalPrice += itemTotal;
  });
  message += `Total: ₦${totalPrice}`;
  window.open(
    `https://wa.me/2348067168043?text=${encodeURIComponent(message)}`,
    "_blank"
  );
  localStorage.removeItem("cart");
  displayCart();
}

document.addEventListener("DOMContentLoaded", function () {
  const readMoreButtons = document.querySelectorAll(".read-more");

  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productDescription = this.previousElementSibling;
      productDescription.classList.toggle("expanded");

      // Change button text based on expanded state
      if (productDescription.classList.contains("expanded")) {
        this.textContent = "See less";
      } else {
        this.textContent = "See more";
      }
    });
  });
});

// Adding search function to the search bar

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-bar"); // Target the input field
  const products = document.querySelectorAll(".product"); // Get all products
  const productContainer = document.querySelector(".product-row"); // Parent container
  let noResultsMessage = document.createElement("p"); // Create a "No results" message
  noResultsMessage.innerText = "No items match your search.";
  noResultsMessage.style.display = "none"; // Initially hidden
  noResultsMessage.style.textAlign = "center";
  noResultsMessage.style.fontSize = "18px";
  noResultsMessage.style.color = "red";
  productContainer.parentNode.insertBefore(noResultsMessage, productContainer); // Insert message before product rows

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase().trim(); // Get the entered text
    let matchFound = false; // Track if any match is found

    products.forEach((product) => {
      const productName = product
        .querySelector(".product-name")
        .innerText.toLowerCase();
      const productText = product.innerText.toLowerCase(); // Get all text inside the product

      if (
        productName.includes(searchTerm) ||
        productText.includes(searchTerm)
      ) {
        product.style.display = "block"; // Show matching products
        matchFound = true; // At least one match found
      } else {
        product.style.display = "none"; // Hide non-matching products
      }
    });

    // Show "No results" message if no match is found
    if (!matchFound) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }
  });
});
