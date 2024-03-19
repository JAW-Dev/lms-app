import React from 'react';
// Helpers
import GetAttribute from '../../helpers/getAttribute';

/**
 * Content Wrapper Element component for wrapping content within a container.
 * @param {Object} props - The props for the ContentWrapperElement component.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the content wrapper.
 * @param {Object} props.options - The options for the content wrapper element.
 * @param {string} props.options.wrapperClasses - Additional CSS classes for the content wrapper element.
 * @param {Object} props.options.wrapperStyle - Additional inline styles for the content wrapper element.
 * @returns {JSX.Element} - The rendered ContentWrapperElement component.
 */
const ContetnWrapperElement = ({ children, options }) => {
  const {
    wrapperClasses = '',
    wrapperStyle = {}
  } = options;

  return (
    <div id="content-wrapper" className={`content-wrapper${GetAttribute(wrapperClasses)}`} style={wrapperStyle}>
      {children}
    </div>
  );
};

export default ContetnWrapperElement;
