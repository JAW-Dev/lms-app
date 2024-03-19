import React, { createContext, useContext, useState } from 'react';

// Create a context for modal functionality
const ModalContext = createContext();

/**
 * Hook to access the modal context.
 *
 * @returns {Object} Modal context values
 * @throws {Error} If used outside of ModalProvider
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  const { content, setContent, isLoading, setIsLoading } = context;

  return {
    content,
    setContent,
    isLoading,
    setIsLoading,
  };
};

/**
 * Provider component for the modal context.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render inside the provider
 * @returns {React.ReactNode} ModalProvider component
 */
export const ModalProvider = ({ children }) => {
  const [content, setContent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <ModalContext.Provider
      value={{
        content,
        setContent,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default useModal;
