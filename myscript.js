const header = document.querySelector("header");
window.addEventListener("scroll", function () {
  if (document.documentElement.scrollTop > 20) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

function sendMessage(productName, price) {
  const phoneNumber = "2348067168043"; // Seller's WhatsApp number
  const message = `Hello, I'd like to order the ${productName} for ₦${price}.`;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}
