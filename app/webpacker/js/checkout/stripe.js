import "core-js/features/object/values";
import React, { useState, useEffect, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { useDebounce, fetchStatus } from "../util";

// Hooks
import useResponsive from "../../packs/v2/hooks/useResponsive";

const inputStyles = {
  style: {
    base: {
      fontSize: "16px",
      fontWeight: 500,
      fontSmoothing: "antialiased",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "#b8c2cc",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const CheckoutForm = ({
  fields,
  setFields,
  setFormStatus,
  setProcessor,
  setCardElement,
  addBillingAndTax,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [fieldState, setFieldState] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    if (!elements) return;
    const card = elements.getElement(CardNumberElement);
    setCardElement(card);
  }, [elements]);

  useEffect(() => {
    fetch("/countries.json")
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then((resp) => {
        setCountries(resp);
        setFields({ ...fields, country_alpha2: "US" });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("request failed", error);
      });
  }, []);

  useEffect(() => {
    if (fields.country_alpha2) {
      fetch(`/states.json?country=${fields.country_alpha2}`)
        .then((resp) => fetchStatus(resp))
        .then((resp) => resp.json())
        .then((resp) => setStates(resp))
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("request failed", error);
        });
    }
  }, [fields.country_alpha2]);

  const debouncedFields = useDebounce(fields, 1000);
  useEffect(() => {
    const stateAddress =
      fields.country_alpha2 === "US" || fields.country_alpha2 === "CA";
    if (
      ((stateAddress && fields.zip) || !stateAddress) &&
      fields.line1 &&
      fields.city &&
      fields.full_name
    ) {
      addBillingAndTax();
    }
  }, [debouncedFields]);

  useEffect(() => {
    setProcessor(stripe);
  }, [stripe]);

  useEffect(() => {
    const formFields = Object.values(fieldState);
    const formValid = formFields.length && formFields.every((field) => field);
    setFormStatus((prevStatus) => ({ ...prevStatus, valid: formValid }));
  }, [fieldState]);

  const checkValid = (field, valid = false) => {
    setFieldState({ ...fieldState, [field]: valid });
  };

  const { isTablet } = useResponsive();

  return (
    <div className="relative">
      <p className="text-grey font-bold absolute" style={{ top: "-48px" }}>
        Subscribe to Admired Leadership
      </p>
      <h2
        className="mb-8"
        style={{
          fontSize: "48px",
          fontWeight: "800",
          letterSpacing: "-2.4px",
          lineHeight: "48px",
        }}
      >
        Your Payment Details
      </h2>

      <div className="flex flex-col mb-6" style={{ gap: "0px" }}>
        <label className="text-sm text-charcoal font-bold pb-2">
          Full Name
        </label>
        <div
          className="px-2 py-2 flex items-center border-2 false"
          style={{ borderRadius: "12px", minwidth: "100%" }}
        >
          <input
            type="text"
            name="full_name"
            className="focus:outline-none w-full"
            defaultValue={fields.full_name}
            onInput={(e) => {
              setFields({
                ...fields,
                [e.target.name]: e.target.value,
              });
              checkValid(e.target.name, e.target.value !== "");
            }}
            required
          />
        </div>
      </div>

      {/* <div className="mb-6">
        <label className="block">
          <span className="block text-sm text-charcoal font-bold pb-2">
            Full Name
          </span>
          <div className="pb-6" style={{ fontSize: "14px" }}>
            <input
              type="text"
              name="full_name"
              className="focus:outline-none w-full"
              defaultValue={fields.full_name}
              onInput={(e) => {
                setFields({
                  ...fields,
                  [e.target.name]: e.target.value,
                });
                checkValid(e.target.name, e.target.value !== "");
              }}
              // style={{ ...inputStyles.style.base }}
              required
            />
          </div>
        </label>
      </div> */}

      <div className="flex flex-col mb-6" style={{ gap: "0px" }}>
        <label className="text-sm text-charcoal font-bold pb-2">
          Company Name (Optional)
        </label>
        <div
          className="px-2 py-2 flex items-center border-2 false"
          style={{ borderRadius: "12px", minwidth: "100%" }}
        >
          <input
            type="text"
            name="company_name"
            className="focus:outline-none w-full"
            defaultValue={fields.company_name}
            onInput={(e) => {
              setFields({
                ...fields,
                [e.target.name]: e.target.value,
              });
              checkValid(e.target.name, e.target.value !== "");
            }}
          />
        </div>
      </div>

      {/* <div className="mb-6">
        <label className="block">
          <span className="block text-sm text-charcoal font-bold pb-2">
            Company Name (Optional)
          </span>
          <input
            type="text"
            name="company_name"
            className="w-full p-2 bg-grey-lighter shadow-inner"
            defaultValue={fields.company_name}
            onInput={(e) => {
              setFields({
                ...fields,
                [e.target.name]: e.target.value,
              });
              checkValid(e.target.name, e.target.value !== "");
            }}
            style={{ ...inputStyles.style.base }}
          />
        </label>
      </div> */}

      <div className="flex flex-col mb-2" style={{ gap: "0px" }}>
        <label className="text-sm text-charcoal font-bold pb-2">
          Billing Address
        </label>
        <div
          className="px-2 py-2 flex items-center border-2 false"
          style={{ borderRadius: "12px", minwidth: "100%" }}
        >
          <input
            type="text"
            name="line1"
            placeholder="Street address"
            className="focus:outline-none w-full"
            onInput={(e) => {
              setFields({
                ...fields,
                [e.target.name]: e.target.value,
              });
              checkValid(e.target.name, e.target.value !== "");
            }}
            required
          />
        </div>
      </div>

      {/* <div className="mb-3">
        <label className="block">
          <span className="block text-sm text-charcoal font-bold pb-2">
            Billing Address
          </span>
          <input
            type="text"
            name="line1"
            placeholder="Street address"
            className="w-full p-2 bg-grey-lighter shadow-inner"
            onInput={(e) => {
              setFields({
                ...fields,
                [e.target.name]: e.target.value,
              });
              checkValid(e.target.name, e.target.value !== "");
            }}
            style={{ ...inputStyles.style.base }}
            required
          />
        </label>
      </div> */}

      <div className="flex flex-col mb-6" style={{ gap: "0px" }}>
        <div
          className="px-2 py-2 flex items-center border-2 false"
          style={{ borderRadius: "12px", minwidth: "100%" }}
        >
          <input
            type="text"
            name="line2"
            placeholder="Suite / Apt. Number"
            className="focus:outline-none w-full"
            onInput={(e) => {
              setFields({
                ...fields,
                [e.target.name]: e.target.value,
              });
              checkValid(e.target.name, e.target.value !== "");
            }}
          />
        </div>
      </div>

      {/* <div className="relative mb-6">
        <label className="block">
          <span className="block text-sm text-charcoal font-bold pb-2">
            Suite / Apt. Number
          </span>
          <input
            type="text"
            name="line2"
            placeholder="Suite / Apt. Number"
            className="w-full p-2 bg-grey-lighter shadow-inner"
            onInput={(e) => {
              setFields({
                ...fields,
                [e.target.name]: e.target.value,
              });
              checkValid(e.target.name, e.target.value !== "");
            }}
            style={{ ...inputStyles.style.base }}
          />
        </label>
      </div> */}

      <div className="flex flex-col md:flex-row pb-6" style={{ gap: "24px" }}>
        <div style={{ width: isTablet ? "100%" : "50%", fontSize: "14px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">
            Country
          </label>
          <div
            className="px-2 py-2 mt-2 flex items-center border-2 false"
            style={{ borderRadius: "12px", minwidth: "100%" }}
          >
            <select
              name="country_alpha2"
              className="w-full appearance-none"
              onInput={(e) => {
                // eslint-disable-next-line
                const { state_abbr, ...fieldsWithoutState } = fields;
                setFields({
                  ...fieldsWithoutState,
                  [e.target.name]: e.target.value,
                });
                checkValid(e.target.name, e.target.value !== "");
              }}
              value={fields.country_alpha2}
            >
              {countries.map((country) => (
                <option key={country.alpha2} value={country.alpha2}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ width: isTablet ? "100%" : "50%", fontSize: "14px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">City</label>
          <div
            className="px-2 py-2 mt-2 flex items-center border-2 false"
            style={{ borderRadius: "12px", minwidth: "100%" }}
          >
            <input
              type="text"
              name="city"
              className="focus:outline-none w-full"
              onInput={(e) => {
                setFields({
                  ...fields,
                  [e.target.name]: e.target.value,
                });
                checkValid(e.target.name, e.target.value !== "");
              }}
              required
            />
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row mb-6 md:-mx-2">
        <div className="md:w-1/2 mb-6 md:mb-0 md:mx-2">
          <label className="block">
            <span className="block text-sm text-charcoal font-bold pb-2">
              Country
            </span>
            <select
              name="country_alpha2"
              className="w-full border appearance-none p-2 custom-select"
              onInput={(e) => {
                // eslint-disable-next-line
                const { state_abbr, ...fieldsWithoutState } = fields;
                setFields({
                  ...fieldsWithoutState,
                  [e.target.name]: e.target.value,
                });
                checkValid(e.target.name, e.target.value !== "");
              }}
              value={fields.country_alpha2}
            >
              {countries.map((country) => (
                <option key={country.alpha2} value={country.alpha2}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex-1 md:mx-2">
          <label className="block">
            <span className="block text-sm text-charcoal font-bold pb-2">
              City
            </span>
            <input
              type="text"
              name="city"
              className="w-full p-2 bg-grey-lighter shadow-inner"
              onInput={(e) => {
                setFields({
                  ...fields,
                  [e.target.name]: e.target.value,
                });
                checkValid(e.target.name, e.target.value !== "");
              }}
              style={{ ...inputStyles.style.base }}
              required
            />
          </label>
        </div>
      </div> */}

      <div className="flex flex-col md:flex-row pb-6" style={{ gap: "24px" }}>

        {fields.country_alpha2 === "US" && (
          <div style={{ width: isTablet ? "100%" : "50%", fontSize: "14px" }}>
            <label className="text-sm text-charcoal font-bold pb-2">State</label>
            <div
              className="px-2 py-2 mt-2 flex items-center border-2 false"
              style={{ borderRadius: "12px", minwidth: "100%" }}
            >
              <select
                name="state_abbr"
                className="w-full appearance-none"
                onInput={(e) => {
                  setFields({
                    ...fields,
                    [e.target.name]: e.target.value,
                  });
                  checkValid(e.target.name, e.target.value !== "");
                }}
                required={fields.country_alpha2 === "US"}
              >
                <option value="">Select...</option>
                {states.map((state) => (
                  <option key={state.abbr} value={state.abbr}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
         )}

        <div style={{ width: isTablet ? "100%" : "50%", fontSize: "14px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">
            Zip / Postal Code
          </label>
          <div
            className="px-2 py-2 mt-2 flex items-center border-2 false"
            style={{ borderRadius: "12px", minwidth: "100%" }}
          >
            <input
              type="text"
              name="zip"
              className="focus:outline-none w-full"
              onInput={(e) => {
                setFields({
                  ...fields,
                  [e.target.name]: e.target.value,
                });
                checkValid(e.target.name, e.target.value !== "");
              }}
            />
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row mb-6 md:-mx-2">
        {!!states.length && (
          <div className="md:w-1/2 mb-6 md:mb-0 md:mx-2">
            <label className="block">
              <span className="block text-sm text-charcoal font-bold pb-2">
                State
              </span>
              <select
                name="state_abbr"
                className="w-full border p-2 custom-select"
                onInput={(e) => {
                  setFields({
                    ...fields,
                    [e.target.name]: e.target.value,
                  });
                  checkValid(e.target.name, e.target.value !== "");
                }}
                required
              >
                <option value="">Select...</option>
                {states.map((state) => (
                  <option key={state.abbr} value={state.abbr}>
                    {state.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <div className="flex-1 max-w-1/2 md:mx-2">
          <label className="block">
            <span className="block text-sm text-charcoal font-bold pb-2">
              Zip / Postal Code
            </span>
            <input
              type="text"
              name="zip"
              className="w-full p-2 bg-grey-lighter shadow-inner"
              onInput={(e) => {
                setFields({
                  ...fields,
                  [e.target.name]: e.target.value,
                });
                checkValid(e.target.name, e.target.value !== "");
              }}
              style={{ ...inputStyles.style.base }}
            />
          </label>
        </div>
      </div> */}

      <div className="flex flex-col mb-6" style={{ gap: "0px" }}>
        <label className="text-sm text-charcoal font-bold pb-2">
          Card Number
        </label>
        <div
          className="px-2 py-2 flex items-center border-2 false"
          style={{ borderRadius: "12px", minwidth: "100%" }}
        >
          <CardNumberElement
            id="card-number"
            onReady={(e) => checkValid(e._componentName)}
            onChange={(e) => checkValid(e.elementType, e.complete)}
            className="focus:outline-none w-full"
            options={{
              ...inputStyles,
              showIcon: true,
              iconStyle: "solid",
            }}
          />
        </div>
      </div>

      {/* <div className="w-full mb-6">
        <label className="block">
          <span className="block text-sm text-charcoal font-bold pb-2">
            Card Number
          </span>
          <CardNumberElement
            id="card-number"
            onReady={(e) => checkValid(e._componentName)}
            onChange={(e) => checkValid(e.elementType, e.complete)}
            className="max-h-10 p-2 bg-grey-lighter shadow-inner"
            options={{
              ...inputStyles,
              showIcon: true,
              iconStyle: "solid",
            }}
          />
        </label>
      </div> */}

      <div className="flex flex-col md:flex-row pb-6" style={{ gap: "24px" }}>
        <div style={{ width: isTablet ? "100%" : "50%", fontSize: "14px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">
            Expiration Date
          </label>
          <div
            className="px-2 py-2 mt-2 flex items-center border-2 false"
            style={{ borderRadius: "12px", minwidth: "100%" }}
          >
            <CardExpiryElement
              id="card-expiry"
              onReady={(e) => checkValid(e._componentName)}
              onChange={(e) => checkValid(e.elementType, e.complete)}
              className="focus:outline-none w-full"
            />
          </div>
        </div>

        <div style={{ width: isTablet ? "100%" : "50%", fontSize: "14px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">CVC</label>
          <div
            className="px-2 py-2 mt-2 flex items-center border-2 false"
            style={{ borderRadius: "12px", minwidth: "100%" }}
          >
            <CardCvcElement
              id="card-cvc"
              onReady={(e) => checkValid(e._componentName)}
              onChange={(e) => checkValid(e.elementType, e.complete)}
              placeholder="123"
              className="focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row mb-6 md:-mx-2">
        <div className="md:w-1/2 mb-6 md:mb-0 md:mx-2">
          <label className="block">
            <span className="block text-sm text-charcoal font-bold pb-2">
              Expiration Date
            </span>
            <CardExpiryElement
              id="card-expiry"
              onReady={(e) => checkValid(e._componentName)}
              onChange={(e) => checkValid(e.elementType, e.complete)}
              className="max-h-10 p-2 bg-grey-lighter shadow-inner"
              options={inputStyles}
            />
          </label>
        </div>
        <div className="flex-1 md:mx-2">
          <label className="block">
            <span className="block text-sm text-charcoal font-bold pb-2">
              CVC
            </span>
            <CardCvcElement
              id="card-cvc"
              onReady={(e) => checkValid(e._componentName)}
              onChange={(e) => checkValid(e.elementType, e.complete)}
              placeholder="123"
              className="max-h-10 p-2 bg-grey-lighter shadow-inner"
              options={inputStyles}
            />
          </label>
        </div>
      </div> */}
    </div>
  );
};

// const StripeCheckoutForm = injectStripe(CheckoutForm)

export const Payment = ({
  apiKey,
  fields,
  setFields,
  setFormStatus,
  setProcessor,
  setCardElement,
  addBillingAndTax,
}) => {
  // const stripePromise = loadStripe(apiKey);
  const stripePromise = useMemo(() => loadStripe(apiKey), [apiKey]);
  const elementsOptions = {
    fonts: [
      {
        cssSrc: "https://fonts.googleapis.com/css?family=Source+Code+Pro:500",
      },
    ],
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <CheckoutForm
        fields={fields}
        setFields={setFields}
        setFormStatus={setFormStatus}
        setProcessor={setProcessor}
        setCardElement={setCardElement}
        addBillingAndTax={addBillingAndTax}
      />
    </Elements>
  );
};
