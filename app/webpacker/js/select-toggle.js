export const setupSelectToggles = () => {
  const selectToggles = document.querySelectorAll(".toggle-select");
  selectToggles.forEach((toggle) => {
    toggle.addEventListener("change", (e) => {
      const { target } = e;
      const options = Array.from(target.children);
      const anySelected = options.some(
        (option) => option.selected && option.value !== ""
      );
      target.nextElementSibling.classList.toggle("hidden", !anySelected);
    });
  });
};

export const setupCheckboxToggles = () => {
  const checkToggles = document.querySelectorAll(".checkbox--toggle");
  checkToggles.forEach((toggle) => {
    toggle.addEventListener("change", (e) => {
      const { element } = e.target.dataset;
      document.getElementById(element).classList.toggle("hidden");
    });
  });
};
