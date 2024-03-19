import React, { useState, useEffect, forwardRef, useRef } from "react";
import { render, createPortal } from "react-dom";

const Modal = forwardRef(({ description, children, toggleModal }, ref) => {
  const node = document.querySelector(".modal-container");

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      toggleModal(e);
    }
  };

  const modalContent = (
    <div
      role="dialog"
      className="modal"
      onKeyDown={(e) => handleKeyPress(e)}
      tabIndex="0"
      aria-hidden="false"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
    >
      <div className="modal__content" ref={ref}>
        <button
          type="button"
          aria-label="Close dialog"
          className="modal__close"
          autoFocus
          onClick={toggleModal}
        >
          <i className="fas fa-times" />
        </button>
        <div className="screen-reader-text" id="modalDescription">
          {description}
        </div>
        {children}
      </div>
    </div>
  );
  return createPortal(modalContent, node);
});

export const PopupModal = forwardRef(
  (
    { title, description, content, modalType, link, className, children },
    triggerRef
  ) => {
    const refNode = useRef();
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = (e) => {
      if (e.key !== "Escape") {
        e.preventDefault();
      }

      setModalVisible((prevState) => !prevState);
    };

    const handleClickOutside = (e) => {
      if (refNode.current.contains(e.target)) {
        return;
      }
      setModalVisible(false);
    };

    useEffect(() => {
      if (modalVisible) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [modalVisible]);

    useEffect(() => {
      const openModal = () => setModalVisible(true);
      const closeModal = () => setModalVisible(false);

      triggerRef.addEventListener("openModal", openModal);
      triggerRef.addEventListener("closeModal", closeModal);

      return () => {
        triggerRef.removeEventListener("openModal", openModal);
        triggerRef.removeEventListener("closeModal", closeModal);
      };
    }, [triggerRef]);

    const modal = modalVisible ? (
      <Modal ref={refNode} description={description} toggleModal={toggleModal}>
        {title && (
          <h1 id="modalTitle" className="mb-4 text-lg">
            {title}
          </h1>
        )}
        {content && (
          /* eslint-disable-next-line react/no-danger */
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
        {children}
      </Modal>
    ) : null;

    return (
      <div className="inline-block">
        {modalType === "question" && (
          <button
            type="button"
            className={className || "align-middle"}
            onClick={toggleModal}
          >
            <i className="fas fa-question-circle" />
          </button>
        )}
        {modalType === "link" && (
          <span
            role="link"
            className={className || "text-blue-dark underline cursor-pointer"}
            onClick={toggleModal}
            onKeyPress={toggleModal}
            tabIndex={0}
          >
            {link}
          </span>
        )}
        {modalType === "button" && (
          <button
            type="button"
            className={className || "btn btn--primary"}
            onClick={toggleModal}
            onKeyPress={toggleModal}
            tabIndex={0}
          >
            {link}
          </button>
        )}
        {modal}
      </div>
    );
  }
);

const modals = document.querySelectorAll("[data-modal]");
modals.forEach((element) => {
  const {
    title,
    description,
    content,
    modal: modalType = "question",
    link,
    className,
  } = element.dataset;

  render(
    <PopupModal
      {...{ title, description, content, modalType, link, className }}
      ref={element}
    />,
    element
  );
});
