import MicroModal from "micromodal";
import Cookies from "js-cookie";

export const setupModals = () => {
  MicroModal.init();

  try {
    MicroModal.show("alerts-modal", {
      onShow: (modal) => {
        const { content, reappear = "1" } = modal.querySelector("main").dataset;
        Cookies.set(`alert.${content}`, "closed", {
          expires: parseInt(reappear, 10),
        });
      },
    });
  } catch {
    // no alerts to show
  }
};
