const setAccordionProps = (accordion, state = false, height) => {
  const panel = accordion.nextElementSibling;
  accordion.setAttribute("aria-expanded", state);
  panel.setAttribute("aria-hidden", !state);
  panel.style.maxHeight = state ? `${height || panel.scrollHeight}px` : 0;
};

const updateParents = (accordion, height = 0) => {
  const parentPanel = accordion.closest("[data-accordion-panel]");
  const parentAccordion = parentPanel
    ? parentPanel.previousElementSibling
    : null;
  if (parentAccordion && parentAccordion.hasAttribute("data-accordion")) {
    setAccordionProps(parentAccordion, true, height + parentPanel.scrollHeight);
    updateParents(parentAccordion, height + parentPanel.scrollHeight);
  }
};

export const toggleAccordion = (accordion, panel) => {
  const isOpen =
    accordion.hasAttribute("aria-expanded") &&
    accordion.getAttribute("aria-expanded") === "true";

  // Toggle accordion state
  setAccordionProps(accordion, !isOpen);

  // Recalculate height of parent accordions
  updateParents(accordion, panel.scrollHeight);

  // If closing accordion, also close any child accordions
  if (isOpen) {
    const childAccordions = panel.querySelectorAll("[data-accordion]");
    childAccordions.forEach((childAccordion) => {
      setAccordionProps(childAccordion, false);
    });
  }
};

const accordions = document.querySelectorAll("[data-accordion]");
export const setupAccordions = () => {
  accordions.forEach((accordion) => {
    const panel = accordion.nextElementSibling;

    if (panel) {
      // Mark panel so we can reference it later
      panel.setAttribute("data-accordion-panel", true);

      accordion.addEventListener("click", () =>
        toggleAccordion(accordion, panel)
      );
    }
  });

  const toggleAll = document.querySelector("[data-accordion-toggle-all]");
  if (toggleAll) {
    toggleAll.addEventListener("click", () => {
      accordions.forEach((accordion) => {
        const panel = accordion.nextElementSibling;
        if (panel) {
          toggleAccordion(accordion, panel);
        }
      });
    });
  }
};
