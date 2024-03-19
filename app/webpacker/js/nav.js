import "core-js/features/array/from";

export const setupNav = () => {
  const mainNav = document.querySelector(".main-nav");
  if (!mainNav) return; // return early if using a layout with no nav

  const navSlideToggle = document.getElementById("nav-slide-toggle");
  navSlideToggle.addEventListener("click", () => {
    mainNav.classList.toggle("is-collapsed");
    const isCollapsed = mainNav.classList.contains("is-collapsed");
    document.cookie = `collapse-menu=${isCollapsed ? 1 : 0};path=/;max-age=${
      isCollapsed ? 60 * 60 * 24 * 365 * 10 : 0
    }`;
  });

  const navMenuToggle = document.getElementById("nav-menu-toggle");
  navMenuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open");
  });

  const userNav = document.querySelector(".user-menu");
  const userMenuToggle = document.getElementById("user-menu-toggle");
  if (userMenuToggle) {
    userMenuToggle.addEventListener("click", () =>
      userNav.classList.toggle("is-open")
    );
  }

  const navItems = document.querySelectorAll(".nav-item");
  const itemsWithChildren = Array.from(navItems).filter(
    (item) => item.nextElementSibling
  );
  const activeItem = Array.from(navItems).find((item) =>
    item.classList.contains("is-highlighted")
  );

  itemsWithChildren.forEach((navItem) => {
    navItem.addEventListener("click", (e) => {
      e.preventDefault();

      navItem.classList.toggle("is-highlighted");
      Array.from(navItems)
        .filter((item) => item !== navItem)
        .forEach((item) => item.classList.remove("is-highlighted"));

      if (!navItem.classList.contains("is-highlighted")) {
        activeItem.classList.add("is-highlighted");
      }
    });
  });
};
