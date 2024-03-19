import React from "react";
import classNames from "classnames";

export const Summary = ({ order, formStatus, freeGift }) => {
  const orderType = freeGift ? "Send Free Gift" : "Complete Purchase";
  const buttonText = formStatus.pending ? "Processing..." : orderType;
  return (
    <div className="order-form__summary">
      <ul className="list-reset mb-6">
        {order.cart.discount && (
          <li className="cart-item">
            <div className="flex items-center justify-between">
              <span className="cart-item__header text-purple-dark font-bold">
                Preferred Rate Discount
              </span>
              <span className="">{`- ${order.cart.discount}`}</span>
            </div>
          </li>
        )}
        <li className="cart-item">
          <div className="flex items-center justify-between">
            <span className="cart-item__header">Subtotal</span>
            <span className="">{order.subtotal}</span>
          </div>
        </li>
        <li className="cart-item">
          <div className="flex items-center justify-between">
            <span className="cart-item__header">Tax</span>
            <span className="">{order.sales_tax}</span>
          </div>
        </li>
        <li className="cart-item">
          <div className="flex items-center justify-between">
            <span className="cart-item__header font-bold">Total</span>
            <span className=" font-bold">{order.total}</span>
          </div>
        </li>
      </ul>
      <div className="flex justify-end">
        <button
          type="submit"
          className={classNames(
            "uppercase no-underline flex px-6 py-3 bg-link-purple border-2 border-link-purple text-white font-extrabold uppercase rounded-full hover:bg-purple-500 hover:border-purple-500 font-bold capitalize",
            {
              "btn--disabled": formStatus.pending || !formStatus.valid,
            }
          )}
          style={{ width: "fit-content", borderRadius: "16px" }}
          disabled={formStatus.pending}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
