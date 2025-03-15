document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section");

  function checkScroll() {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75) {
        section.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkScroll);
  checkScroll(); // Run on page load
});

const header = document.querySelector("header");
window.addEventListener("scroll", function () {
  if (document.documentElement.scrollTop > 20) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});
