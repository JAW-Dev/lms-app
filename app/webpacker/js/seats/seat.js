import "whatwg-fetch";
import "core-js/features/promise";
import React from "react";
import classNames from "classnames";
import { csrfToken } from "@rails/ujs";
import { fetchStatus, showNotice } from "../util";

export const Seat = ({
  id,
  email,
  status,
  invited_at: invitedAt,
  activated_at: activatedAt,
  setRemaining,
  setSeats,
}) => {
  const resend = (seatId) => {
    fetch(`/program/seats/${seatId}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": csrfToken(),
      },
      body: JSON.stringify({
        user_seat: {
          invited_at: new Date(),
        },
      }),
    })
      .then((resp) => fetchStatus(resp))
      .then((resp) => resp.json())
      .then(({ remaining: remainingSeats, seats: seatDetails }) => {
        showNotice("Invitation resent.");
        setRemaining(remainingSeats);
        setSeats(seatDetails);
      });
  };

  const removeSeat = (seatId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm("Remove this user?")) {
      fetch(`/program/seats/${seatId}.json`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-Token": csrfToken(),
        },
      })
        .then((resp) => fetchStatus(resp))
        .then((resp) => resp.json())
        .then(({ remaining: remainingSeats, seats: seatDetails }) => {
          setRemaining(remainingSeats);
          setSeats(seatDetails);
        });
    }
  };
  return (
    <tr>
      <td
        className={classNames("align-top", "p-2", "md:p-4", "border-b", {
          "bg-red-lightest": status !== "active",
        })}
      >
        <p className="mb-2">{email}</p>
        {!activatedAt && (
          <p className="text-sm">Invitation sent: {invitedAt}</p>
        )}
        {activatedAt && <p className="text-sm">Activated on: {activatedAt}</p>}
      </td>
      <td
        className={classNames(
          "align-top",
          "p-2",
          "md:p-4",
          "text-right",
          "border-b",
          {
            "bg-red-lightest": status !== "active",
          }
        )}
      >
        <p
          className={classNames("mb-2", "text-sm", "uppercase", "font-bold", {
            italic: status !== "active",
          })}
        >
          {status}
        </p>
        <div className="flex flex-col md:flex-row md:items-stretch justify-end md:-mx-1">
          <button
            type="button"
            className={classNames(
              "mb-1",
              "md:mb-0",
              "md:mx-1",
              "btn",
              "btn--sm",
              "btn--primary",
              "rounded",
              {
                hidden: status === "active",
              }
            )}
            onClick={() => resend(id)}
          >
            Resend Invitation
          </button>
          <button
            type="button"
            className="md:mx-1 btn btn--sm btn--warn rounded"
            onClick={() => removeSeat(id)}
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
};
