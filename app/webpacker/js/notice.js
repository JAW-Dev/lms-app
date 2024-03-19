export const setupNotices = () => {
  const closeNotices = document.querySelectorAll(".close-notice");
  closeNotices.forEach((x) => {
    x.addEventListener("click", (e) => {
      const { parentElement } = e.currentTarget;
      parentElement.classList.add("is-hidden");
    });
  });

  const noticeContainer = document.querySelector(".notice");
  document.addEventListener("showAlert", (e) => {
    if (noticeContainer) {
      noticeContainer.classList.remove("is-hidden");
      noticeContainer.classList.add("notice--alert");
      noticeContainer.querySelector("p").textContent = e.detail;
    }
  });

  document.addEventListener("showNotice", (e) => {
    if (noticeContainer) {
      noticeContainer.classList.remove("is-hidden");
      noticeContainer.classList.remove("notice--alert");
      noticeContainer.querySelector("p").textContent = e.detail;
    }
  });

  document.addEventListener("hideNotice", () => {
    if (noticeContainer) {
      noticeContainer.classList.add("is-hidden");
    }
  });
};
