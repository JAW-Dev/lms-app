const toggleInfoButton = (button, panel, force) => {
  const isForce = typeof force !== "undefined";
  const wasExpanded = isForce
    ? !force
    : button.getAttribute("aria-expanded") === "true" || false;
  const expanded = !wasExpanded;
  button.setAttribute("aria-expanded", (!!expanded).toString());
  panel.setAttribute("aria-hidden", (!expanded).toString());
};

const infoButtons = document.querySelectorAll("[data-info]");
export const setupInfoButtons = () => {
  infoButtons.forEach((button) => {
    const id =
      button.hasAttribute("aria-controls") &&
      button.getAttribute("aria-controls");
    const panel = id && document.getElementById(id);

    if (panel) {
      const expanded = button.getAttribute("aria-expanded") === "true" || false;
      button.setAttribute("aria-expanded", (!!expanded).toString());
      panel.setAttribute("aria-hidden", (!expanded).toString());
      panel.setAttribute("data-info-panel", true);

      button.addEventListener("click", (event) => {
        event.preventDefault();
        toggleInfoButton(button, panel);
      });
    }
  });
};
