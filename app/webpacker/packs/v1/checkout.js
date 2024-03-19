import "whatwg-fetch";
import "core-js/features/promise";
import "core-js/features/object/assign";
import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { csrfToken } from "@rails/ujs";
import { nanoid } from "nanoid/async";
import { fetchStatus } from "../../js/util";
import { Payment } from "../../js/checkout/stripe";
import { Cart } from "../../js/checkout/cart";
import { Promo } from "../../js/checkout/promo";
import { Summary } from "../../js/checkout/summary";
import { Gift } from "../../js/checkout/gift";

// Hooks
import useResponsive from "../v2/hooks/useResponsive";

const freeGift = (order) => order.gift && order.total === "$0";

const freeProcessor = {
  createToken: async () => ({
    token: {
      id: await nanoid(),
    },
  }),
};

const Checkout = ({ transaction, apiKey }) => {
  const [token, setToken] = useState(null);
  const [order, setOrder] = useState(null);
  const [formStatus, setFormStatus] = useState({
    valid: false,
    pending: false,
  });
  const [fields, setFields] = useState({});
  const [processor, setProcessor] = useState(null);
  const [cardElement, setCardElement] = useState(null);

  const processSubscription = async () => {
    const { paymentMethod, error } = await processor.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: fields.full_name,
        address: {
          line1: fields.line1,
          line2: fields.line2,
          country: fields.country_alpha2,
          city: fields.city,
          state: fields.state_abbr,
          postal_code: fields.zip,
        },
      },
    });

    const { id } = paymentMethod;
    if (id) {
      fetch(`/program/orders/${transaction}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token": csrfToken(),
        },
        body: JSON.stringify({
          order: {
            payment_method_id: id,
          },
        }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.success) {
            window.location.href = `/program/orders/${transaction}`;
          } else {
            // eslint-disable-next-line no-console
            console.error(resp);
            const { message = "Unknown" } = resp;
            const alertEvent = new CustomEvent("showAlert", {
              detail: `Error: "${message}" Please contact us for assistance.`,
            });
            document.dispatchEvent(alertEvent);
            setFormStatus((prevStatus) => ({
              ...prevStatus,
              pending: false,
            }));
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error("request failed", err);
          setFormStatus((prevStatus) => ({
            ...prevStatus,
            pending: false,
          }));
        });
    } else {
      const alertEvent = new CustomEvent("showAlert", {
        detail: `Error: "${error.message}"`,
      });
      document.dispatchEvent(alertEvent);
    }
  };

  const addBillingAndTax = () => {
    fetch(`/program/orders/${transaction}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": csrfToken(),
      },
      body: JSON.stringify({
        order: {
          billing_address_attributes: fields,
        },
      }),
    })
      .then((resp) => resp.json())
      .then(({ order: orderDetails }) => setOrder(orderDetails));
  };

  const submitPayment = (nonce) => {
    fetch(`/program/orders/${transaction}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": csrfToken(),
      },
      body: JSON.stringify({
        order: {
          nonce,
          billing_address_attributes: fields,
        },
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.success) {
          window.location.href = `/program/orders/${transaction}`;
        } else {
          // eslint-disable-next-line no-console
          console.error(resp);
          const { message = "Unknown" } = resp;
          const alertEvent = new CustomEvent("showAlert", {
            detail: `Error: "${message}" Please contact us for assistance.`,
          });
          document.dispatchEvent(alertEvent);
          setFormStatus((prevStatus) => ({
            ...prevStatus,
            pending: false,
          }));
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("request failed", error);
        setFormStatus((prevStatus) => ({
          ...prevStatus,
          pending: false,
        }));
      });
  };

  const processPayment = async () => {
    const { token: processorToken, error } = await processor.createToken(
      cardElement,
      {
        address_line1: fields.line1,
        address_line2: fields.line2,
        address_country: fields.country_alpha2,
        address_city: fields.city,
        address_state: fields.state_abbr,
        address_zip: fields.zip,
      }
    );

    if (error) {
      const alertEvent = new CustomEvent("showAlert", {
        detail: `Error: "${error.message}"`,
      });
      document.dispatchEvent(alertEvent);
      setFormStatus((prevStatus) => ({ ...prevStatus, pending: false }));
    } else {
      submitPayment(processorToken.id);
    }
  };

  const processOrder = (e) => {
    e.preventDefault();

    if (!formStatus.pending) {
      setFormStatus((prevStatus) => ({ ...prevStatus, pending: true }));

      if (order.order_type === "subscription_order") {
        processSubscription();
      } else {
        processPayment();
      }
    }
  };

  useEffect(() => {
    fetch(`/program/orders/${transaction}.json`)
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then(({ order: orderDetails, token: serverToken }) => {
        setOrder(orderDetails);
        setFields({ full_name: orderDetails.full_name || "" });
        setFormStatus((prevStatus) => ({
          ...prevStatus,
          valid: freeGift(orderDetails),
        }));
        setProcessor(freeProcessor);
        setToken(serverToken);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("request failed", error);
      });
  }, []);

  const { isTablet } = useResponsive();

  return (
    <form
      className="flex flex-col md:flex-row mt-24"
      onSubmit={processOrder}
      style={{ maxWidth: "1440px", margin: "0 auto" }}
    >
      <div
        className="flex-1"
        style={{
          borderRight: isTablet ? "0px" : "1px solid #E4ECF5",
          paddingRight: isTablet ? "0px" : "60px",
        }}
      >
        {token && (
          <div className="order-form__payment">
            {order.gift && (
              <Gift
                transaction={transaction}
                setOrder={setOrder}
                sender={order.full_name}
                behavior={order.cart.title}
              />
            )}
            {!freeGift(order) && (
              <Payment
                apiKey={apiKey}
                setFormStatus={setFormStatus}
                fields={fields}
                setFields={setFields}
                setProcessor={setProcessor}
                setCardElement={setCardElement}
                addBillingAndTax={addBillingAndTax}
              />
            )}
          </div>
        )}
      </div>
      <div
        className="flex-1"
        style={{ paddingLeft: isTablet ? "0px" : "59px" }}
      >
        {order && (
          <Cart order={order} transaction={transaction} setOrder={setOrder} />
        )}
        <Promo />
        {order && (
          <Summary
            order={order}
            formStatus={formStatus}
            freeGift={freeGift(order)}
          />
        )}
      </div>
    </form>
  );
};

const rootEl = document.getElementById("order-form");
const { transaction, api_key: apiKey } = rootEl.dataset;

render(<Checkout transaction={transaction} apiKey={apiKey} />, rootEl);
