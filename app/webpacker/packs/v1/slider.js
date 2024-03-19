import "core-js/features/array/from";
import Hammer from "hammerjs";

const slideTo = (panel, index) => {
  const distance = -100 * index;
  const panelItem = panel.querySelector("li:first-child");
  panelItem.setAttribute("style", `margin-left: ${distance}%`);
};

const setActiveNav = (navItems, selectedItem) => {
  Array.from(navItems, (dot) =>
    dot.classList.remove("supplemental-nav__item--active")
  );
  selectedItem.classList.add("supplemental-nav__item--active");
};

const sliders = document.querySelectorAll("[data-slider]");
sliders.forEach((slider) => {
  const panel = slider.previousElementSibling;
  const navItems = slider.querySelectorAll(".supplemental-nav__item");

  const mc = new Hammer(panel.parentElement);
  mc.on("swipeleft swiperight", (ev) => {
    const selectedItem = slider.querySelector(
      ".supplemental-nav__item--active"
    );
    const { index } = selectedItem.dataset;

    switch (ev.type) {
      case "swipeleft": {
        const nextIndex = Math.min(
          slider.querySelectorAll("li").length - 1,
          parseInt(index, 10) + 1
        );

        slideTo(panel, nextIndex);
        setActiveNav(navItems, navItems.item(nextIndex));
        break;
      }
      case "swiperight": {
        const nextIndex = Math.max(0, parseInt(index, 10) - 1);

        slideTo(panel, nextIndex);
        setActiveNav(navItems, navItems.item(nextIndex));
        break;
      }
      default:
        break;
    }
  });

  slider.addEventListener("click", (e) => {
    const { target: selectedItem } = e;
    const { index } = selectedItem.dataset;

    if (!selectedItem.classList.contains("supplemental-nav__item")) return;

    slideTo(panel, parseInt(index, 10));
    setActiveNav(navItems, selectedItem);
  });
});
