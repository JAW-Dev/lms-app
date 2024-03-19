import React from 'react';
// Helpers
import GetAttribute from '../../helpers/getAttribute';
// Components
import ContentWrapper from './ContentWrapper';

/**
 * Main component for rendering the main content of the application.
 * @param {Object} props - The props for the Main component.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the main component.
 * @param {Object} props.options - The options for the main component.
 * @param {string} props.options.mainClasses - Additional CSS classes for the main component.
 * @param {boolean} props.options.mainDefaultClasses - Flag indicating whether to include default CSS classes for the main component.
 * @param {Object} props.options.mainStyle - Additional inline styles for the main component.
 * @param {boolean} props.options.mainDefaultStyles - Flag indicating whether to include default inline styles for the main component.
 * @param {Object} props.rest - Additional props to be spread on the main element.
 * @returns {JSX.Element} - The rendered Main component.
 */
const Main = ({ children, options, ...rest }) => {
  const {
    mainTag = 'main',
    mainId = 'main',
    mainClasses = '',
    mainDefaultClasses = true,
    mainStyle = {},
    mainDefaultStyles = true
  } = options;

  // Set default classes and styles for the main component if specified.
  const defaultClasses = mainDefaultClasses ? '' : '';
  const defaultStyles = mainDefaultStyles ? {} : {};

  const Tag = mainTag;

  return (
    <Tag id={mainId} className={`${defaultClasses}${GetAttribute(mainClasses)}`} style={{ ...defaultStyles, ...mainStyle }} {...rest}>
      <ContentWrapper options={options}>
        {children}
      </ContentWrapper>
    </Tag>
  );
};

export default Main;
