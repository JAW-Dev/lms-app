import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

function Accordion({ children, isOpen, className, innerClassName }) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{ transition: 'all 0.3s ease', maxHeight: `${contentHeight}px` }}
      className={classNames('overflow-hidden', className)}
      ref={contentRef}
    >
      <div className={innerClassName}>{children}</div>
    </div>
  );
}

export default Accordion;
