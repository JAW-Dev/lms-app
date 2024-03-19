import React from "react";

export const GiftPreview = ({ name, sender, behavior }) => (
  <div className="micromodal" id="gift_preview" aria-hidden="true">
    <div className="micromodal__overlay" tabIndex="-1" data-micromodal-close>
      <div
        className="max-h-screen px-8 py-4 bg-white overflow-y-auto micromodal__container"
        role="dialog"
        aria-modal="true"
        aria-label="Preview of your gift email."
      >
        <header className="flex justify-end mb-2">
          <button
            type="button"
            className="micromodal__close"
            aria-label="Close modal"
            data-micromodal-close
          />
        </header>
        <main className="mb-6 text-grey-darkest leading-normal">
          <div className="text-center">
            <img
              src="https://cra-assets.nyc3.cdn.digitaloceanspaces.com/welcome-email-header.jpg"
              alt="Welcome to Admired Leadership logo"
              className="w-100"
            />
          </div>
          <div className="p-4">
            {name && (
              <p className="mb-2 text-grey-darkest font-bold text-2xl">
                Hi {name},
              </p>
            )}
            <p className="mb-2 text-grey-darkest">
              Someone clearly cares about you and your leadership.
            </p>
            <p className="mb-2 text-grey-darkest">
              {sender} has given you a valuable gift — a leadership behavior
              from Admired Leadership.
            </p>
            <p className="mb-2 text-grey-darkest">
              The title of the behavior is:
            </p>
            <p className="mb-2 text-grey-darkest font-bold">{behavior}</p>
            <p className="mb-2 text-grey-darkest">Your gift includes:</p>
            <ul className="mx-0 mb-2 pl-6 text-grey-darkest">
              <li>
                A short video explaining the behavior (plus additional study
                materials)
              </li>
              <li>
                The introduction video for the particular leadership module
              </li>
              <li>
                All five foundational videos: An Introduction to Admired
                Leadership
              </li>
            </ul>
            <p className="mb-2 text-grey-darkest">
              In all, you have access to about one hour of vital video content.
            </p>
            <p className="mb-3 text-grey-darkest">
              To learn more about your gift and Admired Leadership... just click
              to get started!
            </p>
            <div className="flex justify-center">
              <p className="w-1/2 btn btn--sm btn--primary-gradient">
                Get Started
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
);
