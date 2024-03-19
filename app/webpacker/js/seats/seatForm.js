import "whatwg-fetch";
import "core-js/features/promise";
import React, { useState } from "react";
import classNames from "classnames";
import { csrfToken } from "@rails/ujs";
import { emailIsValid, showAlert, showNotice } from "../util";

export const SeatForm = ({
  transaction,
  remaining,
  setRemaining,
  setSeats,
}) => {
  const [email, setEmail] = useState("");

  const addSeat = () => {
    if (!emailIsValid(email)) return;

    setEmail("");
    document.dispatchEvent(new CustomEvent("hideNotice"));

    fetch(`/program/orders/${transaction}/seats.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": csrfToken(),
      },
      body: JSON.stringify({
        user_seat: {
          email,
          status: "pending",
        },
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.errors) {
          const errors = resp.errors.join(", ");
          showAlert(`Error: ${errors}.`);
        } else {
          const { remaining: remainingSeats, seats: seatDetails } = resp;
          showNotice("Invitation sent.");
          setRemaining(remainingSeats);
          setSeats(seatDetails);
        }
      });
  };

  return (
    <form
      className={classNames("mb-8", "lg:max-w-1/2", {
        hidden: !remaining,
      })}
    >
      <div className="flex items-center -mx-2">
        <label className="block mb-1 mx-2 font-bold" htmlFor="seat-email">
          Email address:
        </label>
        <input
          type="email"
          name="seat-email"
          id="seat-email"
          className="flex-1 p-2 bg-grey-lighter shadow-inner"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="button"
          className="mx-2 btn btn--primary rounded"
          onClick={addSeat}
        >
          Add User
        </button>
      </div>
    </form>
  );
};
