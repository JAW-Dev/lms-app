export const setupProgressBars = () => {
  const oberverOptions = {
    threshold: window.outerWidth > 768 ? 0.7 : 0.4,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector(".progress-bar");
        if (progressBar) {
          progressBar.classList.add("progress-bar--visible");

          const { progress } = progressBar.dataset;
          progressBar
            .querySelector(".progress-bar__progress")
            .style.setProperty("width", progress);
        }
      }
    });
  }, oberverOptions);

  const progressContainers = document.querySelectorAll("[data-progress]");
  progressContainers.forEach((container) => observer.observe(container));
};
