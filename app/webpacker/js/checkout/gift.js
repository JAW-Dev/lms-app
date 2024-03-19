import React, { useState, useEffect } from "react";
import { csrfToken } from "@rails/ujs";
import MicroModal from "micromodal";
import { GiftPreview } from "./gift-preview";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import { format, parse, add } from 'date-fns';

export const Gift = ({ transaction, setOrder, sender, behavior }) => {
  const [recipientName, setRecipientName] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState(null);
  const [message, setMessage] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [anonymous, setAnonymous] = useState(false);

  const toggleAnonymous = () => {
    setAnonymous((prevState) => !prevState);
  };

  useEffect(() => {
    MicroModal.init();
  }, []);

  useEffect(() => {
    const emailRegex = new RegExp(
      /\b[a-z0-9_.-]+@[a-z0-9_.-]+\.\w{2,4}\b/,
      "i"
    );
    if (emailRegex.test(recipientEmail)) {
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
            gift_attributes: {
              recipient_name: recipientName,
              recipient_email: recipientEmail,
              expires_at: expiresAt ? expiresAt.toISOString() : null,
              message,
              anonymous,
            },
          },
        }),
      })
        .then((resp) => resp.json())
        .then(({ order: orderDetails }) => setOrder(orderDetails));
    }
  }, [recipientName, recipientEmail, expiresAt, anonymous, message]);

  const giftSender = anonymous || !sender ? "Someone" : sender;

  function parseDate(str, dateFormat, locale) {
    const parsed = parse(str, dateFormat, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  }
  

  function formatDate(date, dateFormat, locale) {
    return format(date, dateFormat, { locale });
  }

  return (
    <>
      <div className="mb-8">
        <h2
          className="mb-8"
          style={{
            fontSize: "48px",
            fontWeight: "800",
            letterSpacing: "-2.4px",
            lineHeight: "48px",
          }}
        >
          Add Gift Recipient
        </h2>
        <p className="mb-2 text-sm text-grey-darkest">
          Once you fill out the information below, we will send the giftee an
          email with the link for them to access the behavior. (
          <a
            href="javascript:;"
            className="text-blue-dark"
            data-micromodal-trigger="gift_preview"
          >
            Preview gift email
          </a>
          )
        </p>
        <p className="mb-2 text-sm text-grey-darkest">
          Note that you have the option to remain anonymous if you desire.
        </p>
        <p className="mb-2 text-sm text-grey-darkest">
          You will also receive an email confirming your gift. Notification to
          the recipient of your gift will be sent to them right away. You may
          want to alert them to be on the lookout for a special email from
          Admired Leadership — just in case it ends up in a spam or junk folder.
        </p>
        <p className="mb-4 text-sm text-grey-darkest">
          Once again, thank you for developing the leadership of others. Your
          action is a sign of extraordinary leadership.
        </p>
        <p className="mb-6 text-sm text-grey-darkest italic text-right">
          The Admired Leadership Team
        </p>

        <div className="flex flex-col mb-6" style={{ gap: "0px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">
            Recipient name
          </label>
          <div
            className="px-2 py-2 flex items-center border-2 false"
            style={{ borderRadius: "12px", minwidth: "100%" }}
          >
            <input
              type="text"
              name="recipient_name"
              id="recipient_name"
              className="focus:outline-none w-full"
              placeholder="Full Name"
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col mb-6" style={{ gap: "0px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">
            Recipient e-mail address
          </label>
          <div
            className="px-2 py-2 flex items-center border-2 false"
            style={{ borderRadius: "12px", minwidth: "100%" }}
          >
            <input
              type="email"
              name="recipient_email"
              id="recipient_email"
              className="focus:outline-none w-full"
              placeholder="email@example.com"
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col mb-6" style={{ gap: "0px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">
            Message (optional)
          </label>
          <div
            className="px-2 py-2 flex items-center border-2 false"
            style={{ borderRadius: "12px", minwidth: "100%" }}
          >
            <textarea
              name="message"
              id="message"
              className="focus:outline-none w-full"
              placeholder="Your message here..."
              onChange={(e) => setMessage(e.target.value)}
              maxLength="800"
              rows="6"
            />
          </div>
        </div>

        <div className="flex flex-col mb-6" style={{ gap: "0px" }}>
          <label className="text-sm text-charcoal font-bold pb-2">
            Expired Date (optional)
          </label>
          <DayPickerInput
            formatDate={formatDate}
            format="MM/dd/yyyy"
            parseDate={parseDate}
            clickUnselectsDay
            value={expiresAt}
            onDayChange={(selectedDay) => setExpiresAt(selectedDay)}
            inputProps={{
              name: 'expires_at',
              className: 'mx-1 p-2 bg-grey-lighter shadow-inner',
              autoComplete: 'off'
            }}
            dayPickerProps={{
              disabledDays: {
                before: new Date()
              }
            }}
          />
        </div>

        <label className="flex items-baseline -mx-1 mt-2 mb-1">
          <input
            type="checkbox"
            name="anonymous"
            id="anonymous"
            className="mx-1"
            onChange={toggleAnonymous}
          />
          <span className="mx-1 text-sm text-grey-darkest">
            Send gift anonymously?
          </span>
        </label>
      </div>

      <GiftPreview
        name={recipientName}
        sender={giftSender}
        behavior={behavior}
      />
    </>
  );
};
