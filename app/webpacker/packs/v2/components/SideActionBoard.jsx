import React, { useEffect } from 'react';

const SideActionBoard = ({ children, setOpenSideActionBoard }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenSideActionBoard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setOpenSideActionBoard]);

  return (
    <div style={{ zIndex: '10000' }} className="fixed pin-t pin-r">
      <div className="relative w-screen h-screen">
        <div
          onClick={() => setOpenSideActionBoard()}
          style={{ background: 'rgba(139, 127, 219, 0.1)' }}
          className="w-full h-full absolute pin-t pin-r"
        />

        <div
          style={{ borderTopLeftRadius: '16px' }}
          className="side-action-board h-full py-4"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideActionBoard;
