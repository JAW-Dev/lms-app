import React from "react";

export const Promo = () => (
  <div className="hidden order-form__promos">
    <label htmlFor="promo-code" className="block mb-1 font-bold">
      Promo Code
    </label>
    <div className="flex flex-col md:flex-row md:mb-6 md:-mx-2">
      <input
        type="text"
        name="promo-code"
        id="promo-code"
        className="w-full md:w-2/3 mb-2 md:mb-0 md:mx-2 p-2 bg-grey-lighter shadow-inner"
      />

      <button
        type="button"
        className="flex-1 w-full md:w-auto mb-6 md:mx-2 md:mb-0 btn btn--secondary rounded"
      >
        Apply
      </button>
    </div>
  </div>
);
