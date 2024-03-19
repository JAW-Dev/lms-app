import React, { useEffect } from "react";
import { csrfToken } from "@rails/ujs";
import { showAlert } from "../util";

export const Cart = ({ transaction, order, setOrder }) => {
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("hideNotice"));
    if (order && order.errors.length) {
      const errors = order.errors.join(", ");
      showAlert(`Error: ${errors}.`);
    }
  }, [order]);

  const updateQty = (e) => {
    const { value } = e.target;
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
          qty: value,
        },
      }),
    })
      .then((resp) => resp.json())
      .then(({ order: orderDetails }) => setOrder(orderDetails));
  };

  return (
    <div className="order-form__cart">
      <h2
        className="mb-8"
        style={{ fontSize: "24px", fontWeight: "700", marginTop: "12px" }}
      >
        Your Order
      </h2>
      <ul className="list-reset">
        <li className="cart-item">
          <div className="flex items-center justify-between">
            <h3 className="cart-item__header">{order.cart.title}</h3>
            <span className="font-bold">{order.cart.base_price}</span>
          </div>
          {order.enterprise && (
            <div className="flex items-center mt-1 -mx-1">
              <span className="text-sm mx-1">Seats:</span>
              <input
                type="number"
                min="1"
                step="1"
                name="seats"
                value={order.qty}
                onChange={updateQty}
                className="w-16 mx-1 py-1 pl-2 text-sm border"
              />
            </div>
          )}
          {["course_order"].includes(order.order_type) && (
            <p className="mt-5 p-4 bg-grey-lighter rounded">
              The full access is valid for 1-year from date of purchase.
              <br />
              Renewal is $200 a year and does not automatically renew.
            </p>
          )}
          {["subscription_order"].includes(order.order_type) && (
            <p className="mt-5 p-4 rounded" style={{ background: "#F5F5F5" }}>
              Your subscription will automatically begin and your account will
              be charged once your full access has expired.
              <br />
              The subscription will auto renew annually until it is cancelled.
            </p>
          )}
        </li>
      </ul>
    </div>
  );
};
