import "whatwg-fetch";
import "core-js/features/promise";
import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import classNames from "classnames";
import { fetchStatus } from "../../js/util";
import { Seat } from "../../js/seats/seat";
import { SeatForm } from "../../js/seats/seatForm";

const Checkout = ({ transaction }) => {
  const [seats, setSeats] = useState([]);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    fetch(`/program/orders/${transaction}/seats.json`)
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then(({ remaining: remainingSeats, seats: seatDetails }) => {
        setRemaining(remainingSeats);
        setSeats(seatDetails);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("request failed", error);
      });
  }, []);

  const seatList = seats.map((seat) => (
    <Seat
      key={seat.id}
      {...seat}
      setRemaining={setRemaining}
      setSeats={setSeats}
    />
  ));

  return (
    <div className="mb-16">
      <div className="mb-8">
        <h3 className="mb-8 text-brown leading-tight text-xl lg:text-2xl">
          Seats remaining: {remaining}
        </h3>
      </div>

      <SeatForm
        transaction={transaction}
        remaining={remaining}
        setRemaining={setRemaining}
        setSeats={setSeats}
      />

      <table
        className={classNames("w-full", "border-b", {
          hidden: seats.length === 0,
        })}
      >
        <thead>
          <tr>
            <th className="w-2/3 px-4 text-left border-b">Email</th>
            <th className="px-4 text-right border-b">Status</th>
          </tr>
        </thead>
        <tbody>{seatList}</tbody>
      </table>
    </div>
  );
};

const rootEl = document.getElementById("user-seats");
const { transaction } = rootEl.dataset;

render(<Checkout transaction={transaction} />, rootEl);
