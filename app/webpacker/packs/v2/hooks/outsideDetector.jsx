import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function useOutsideDetector(ref, stateSetter) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        stateSetter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, stateSetter]);
}

function OutsideDetector({ stateSetter, el, ...props }) {
  const elRef = useRef(el || 'div');
  const wrapperRef = useRef(null);
  useOutsideDetector(wrapperRef, stateSetter);

  return <elRef.current className="z-50" {...props} ref={wrapperRef} />;
}

OutsideDetector.propTypes = {
  stateSetter: PropTypes.func.isRequired
};

export default OutsideDetector;
