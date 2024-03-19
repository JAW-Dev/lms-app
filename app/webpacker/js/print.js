export const setupPrint = () => {
  const printLinks = document.querySelectorAll("[data-print]");
  printLinks.forEach((link) => {
    link.addEventListener("click", () => {
      window.print();
    });
  });
};
