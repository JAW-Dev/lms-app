import React, { useEffect } from "react";
import { client, hostedFields } from "braintree-web";

export const Payment = ({ token, setFields, setFormStatus }) => {
  useEffect(() => {
    client
      .create({
        authorization: token,
      })
      .then((clientInstance) =>
        hostedFields.create({
          client: clientInstance,
          fields: {
            number: {
              selector: "#card-number",
              placeholder: "4111 1111 1111 1111",
            },
            cvv: {
              selector: "#cvv",
              placeholder: "123",
            },
            expirationDate: {
              selector: "#expiration-date",
              placeholder: "MM/YY",
            },
            postalCode: {
              selector: "#postal-code",
              placeholder: "12345",
            },
          },
          styles: {
            input: {
              "font-size": "16px",
              "font-family":
                "Nunito Sans, tahoma, calibri, helvetica, sans-serif",
            },
          },
        })
      )
      .then((hostedFieldsInstance) => {
        hostedFieldsInstance.on("validityChange", (event) => {
          const validFields = Object.keys(event.fields).map(
            (key) => event.fields[key].isValid
          );
          const formValid = validFields.every((field) => field);
          setFormStatus((prevStatus) => ({
            ...prevStatus,
            valid: formValid,
          }));
        });

        setFields({
          instance: hostedFieldsInstance,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("request failed", error);
      });
  }, []);

  return (
    <div className="order-form__payment">
      <h2 className="mb-8 text-brown leading-tight text-2xl lg:text-3xl">
        Your Payment Details
      </h2>

      <div className="flex flex-col md:flex-row mb-6 md:-mx-2">
        <div className="md:w-2/3 mb-6 md:mb-0 md:mx-2">
          <label htmlFor="card-number" className="block mb-1 font-bold">
            Card Number
          </label>
          <div
            id="card-number"
            className="h-8 p-2 bg-grey-lighter shadow-inner"
          />
        </div>

        <div className="flex-1 md:mx-2">
          <label htmlFor="cvv" className="block mb-1 font-bold">
            CVV
          </label>
          <div id="cvv" className="h-8 p-2 bg-grey-lighter shadow-inner" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row mb-6 md:-mx-2">
        <div className="md:w-2/3 mb-6 md:mb-0 md:mx-2">
          <label htmlFor="expiration-date" className="block mb-1 font-bold">
            Expiration Date
          </label>
          <div
            id="expiration-date"
            className="h-8 p-2 bg-grey-lighter shadow-inner"
          />
        </div>

        <div className="flex-1 md:mx-2">
          <label htmlFor="postal-code" className="block mb-1 font-bold">
            Zip Code
          </label>
          <div
            id="postal-code"
            className="h-8 p-2 bg-grey-lighter shadow-inner"
          />
        </div>
      </div>
    </div>
  );
};
