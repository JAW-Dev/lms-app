import "whatwg-fetch";
import "core-js/features/promise";
import { csrfToken } from "@rails/ujs";
import MicroModal from "micromodal";
import Cookies from "js-cookie";

document.body.addEventListener("ajax:send", () => {
  MicroModal.show("processing-modal");
});

document.body.addEventListener("ajax:success", () => {
  window.location.reload();
  MicroModal.close("processing-modal");
  // MicroModal.show('cancel-confirmation-modal', {
  //   onClose(modal) {
  //     const { transaction, content, reappear = '90' } = modal.querySelector('main').dataset;
  //     const { value = '0' } = modal.querySelector('[name="renew-remind"]');
  //     Cookies.set(`alert.${content}`, 'closed', { expires: parseInt(reappear, 10) });
  //     if (value !== '0') {
  //       fetch(`/program/subscription_orders/${transaction}.json`, {
  //         method: 'PATCH',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //           'X-Requested-With': 'XMLHttpRequest',
  //           'X-CSRF-Token': csrfToken()
  //         },
  //         body: JSON.stringify({
  //           subscription_order: {
  //             reminder: value
  //           }
  //         })
  //       })
  //         .then((resp) => resp.json())
  //         .then(() => window.location.reload())
  //         .catch((error) => {
  //           // eslint-disable-next-line no-console
  //           console.error('request failed', error);
  //         });
  //     } else {
  //       window.location.reload();
  //     }
  //   }
  // });
});

// eslint-disable-next-line no-alert
document.body.addEventListener("ajax:error", () =>
  alert("An error occurred. Please try again.")
);
