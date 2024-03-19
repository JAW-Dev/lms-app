import { motion } from 'framer-motion/dist/framer-motion';
import React, { useEffect } from 'react';
import SVG from 'react-inlinesvg';
import classNames from 'classnames';

import { useModal } from '../context/ModalContext';

import XIcon from '../../../../assets/images/reskin-images/icon--x.svg';

/**
 * Modal component that displays the modal content.
 * It handles the overlay, animation, and close button.
 *
 * @returns {React.ReactNode} Modal component
 */
const Modal = () => {
  const { content, setContent, isLoading } = useModal();
  const isOnboarding = content?.modalType === 'onboarding';
  const overlayClick = setContent;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOnboarding && event.key === 'Enter') {
        setContent();
      } else if (event.key === 'Escape') {
        setContent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOnboarding, setContent]);

  if (!content) return null;

  const overlay = isOnboarding
    ? { background: 'rgba(20, 20, 20, 0.6)' }
    : { background: 'rgba(139, 127, 219, 0.1)' };

  const closeButton = (
    <button
      className="flex ml-auto"
      type="button"
      onClick={() => setContent(null)}
      id="modal-close"
    >
      <SVG src={XIcon} />
    </button>
  );

  const contentClasses = classNames(
    'react-modal relative flex flex-col overflow-hidden',
    {
      'bg-white z-50 rounded-xl onboarding-modal h-auto': isOnboarding,
      'bg-white z-50 md:rounded-xl shadow-lg md:h-auto': !isOnboarding,
    }
  );

  return (
    <div
      style={{ zIndex: 100000 }}
      className="w-screen h-screen fixed pin-l pin-t"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Overlay */}
        <div
          id="modal-overlay"
          onClick={() => overlayClick(null)} // Change this line
          style={overlay}
          className="w-full h-full absolute pin-l pin-t"
          role={isOnboarding ? undefined : 'button'} // Add role "button" for accessibility
          aria-label={isOnboarding ? undefined : 'Close Modal'} // Add aria-label for accessibility
          tabIndex={isOnboarding ? undefined : 0} // Add tabIndex for keyboard focus
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={contentClasses}
        >
          <div className="modal-header">
            <div className="flex flex-col">
              <h3>
                {isOnboarding && (
                  <span className="modal-header__new mr-4">
                    {content.titleCallout || 'NEW'}
                  </span>
                )}
                {content.icon}
                {content.modalTitle}
              </h3>
              {content.subTitle && (
                <p className="pt-2" style={{fontSize: '14px'}}>{content.subTitle}</p>
              )}
            </div>
            {closeButton}
          </div>

          {/* Modal Content */}
          <div className="flex flex-col md:block h-full md:h-auto px-6 pt-4 pb-0 md:pb-4 overflow-y-scroll md:overflow-auto">
            {content.content}
          </div>

          {content.footer && (
              <div className="border-t border-gray-dark p-4" >{content.footer}</div>
          )}

          {isLoading && <StepLoader />}
        </motion.div>
      </div>
    </div>
  );
};

export function StepLoader({ className }) {
  return (
    <div
      className={classNames(
        'absolute z-10 w-full h-full bg-white pin-t pin-l opacity-50',
        className
      )}
    >
      <div className="w-full h-1 bg-gray relative">
        <motion.div
          className="h-1 bg-link-purple"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear'
          }}
        />
      </div>
    </div>
  );
}

export function CancelButton({classes, text = 'Cancel'}) {
  const { setContent } = useModal();

  return (
    <button
      type="button"
      className={`py-3 px-4 bg-white font-bold ${classes}`}
      onClick={() => setContent(null)}
    >
      {text}
    </button>
  );
}

export default Modal;
