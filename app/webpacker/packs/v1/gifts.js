const giftToggle = document.querySelector(".gift-toggle");
if (giftToggle) {
  giftToggle.addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("gift-toggle--open");
    e.currentTarget.nextElementSibling.classList.toggle("gift-content--open");
  });
}
