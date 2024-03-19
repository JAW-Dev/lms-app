import React from 'react';
import GetAttribute from '../../helpers/getAttribute';

/**
 * Content Inner component for wrapping the main content elements.
 * @param {Object} props - The props for the ContentInner component.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the content inner.
 * @param {Object} props.options - The options for the content inner.
 * @param {string} props.options.innerClasses - Additional CSS classes for the content inner.
 * @param {boolean} props.options.innerDefaultClasses - Flag indicating whether to include default CSS classes for the content inner.
 * @param {Object} props.options.innerStyle - Additional inline styles for the content inner.
 * @returns {JSX.Element} - The rendered ContentInner component.
 */
const ContentInner = ({ children, options }) => {
  const {
    innerClasses = '',
    innerDefaultClasses = true,
    innerStyle = {}
  } = options;

  // Set default classes for the content inner if specified.
  const defaultClasses = innerDefaultClasses ? 'content-inner flex flex-col lg:flex-row relative' : '';

  return (
    <div id="content-inner" className={`${defaultClasses}${GetAttribute(innerClasses)}`} style={innerStyle}>
      {children}
    </div>
  );
};

export default ContentInner;
