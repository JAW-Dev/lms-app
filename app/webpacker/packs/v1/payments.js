import { loadStripe } from "@stripe/stripe-js";
import { csrfToken } from "@rails/ujs";
import MicroModal from "micromodal";

const elementsOptions = {
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Source+Code+Pro:500",
    },
  ],
};

const inputStyles = {
  classes: { base: "p-2 bg-grey-lighter shadow-inner" },
  style: {
    base: {
      fontSize: "16px",
      fontFamily: "Source Code Pro, monospace",
      fontWeight: 500,
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#b8c2cc",
        textTransform: "capitalize",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

MicroModal.init({
  onShow: async (modal) => {
    const { api_key: apiKey, user } = modal.dataset;
    const stripe = await loadStripe(apiKey);
    const elements = stripe.elements(elementsOptions);

    const cardElement = elements.create("card", inputStyles);
    cardElement.mount("#card-element");

    const form = document.getElementById("update-payment-method");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      const { id } = paymentMethod;
      if (id) {
        fetch(`/users/${user}.json`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": csrfToken(),
          },
          body: JSON.stringify({
            user: {
              payment_method_id: id,
            },
          }),
        })
          .then((resp) => resp.json())
          .then((resp) => {
            if (resp.success) {
              window.location.reload();
            } else {
              // eslint-disable-next-line no-console
              console.error(resp);
              MicroModal.close(modal.id);
              const { message = "Unknown" } = resp;
              const alertEvent = new CustomEvent("showAlert", {
                detail: `Error: "${message}" Please contact us for assistance.`,
              });
              document.dispatchEvent(alertEvent);
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error("request failed", err);
          });
      } else {
        MicroModal.close(modal.id);
        const alertEvent = new CustomEvent("showAlert", {
          detail: `Error: "${error.message}"`,
        });
        document.dispatchEvent(alertEvent);
      }
    });
  },
});
