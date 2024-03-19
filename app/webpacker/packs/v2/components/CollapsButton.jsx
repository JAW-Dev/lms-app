import React from 'react';
import SVG from 'react-inlinesvg';
import IconChevronLeft from '../../../../assets/images/reskin-images/icon--chevron-left.svg';
import IconChevronRight from '../../../../assets/images/reskin-images/icon--chevron-right.svg';
import GetAttribute from '../helpers/getAttribute';

/**
 * Button component for collapsing and expanding the sidebar.
 * @param {Object} options - The options for the collapsible button.
 * @param {string} options.layout - The layout of the button ('right' or 'left').
 * @param {string} options.sidebarWidth - The width of the sidebar.
 * @param {boolean} options.isSidebarCollapsed - Flag indicating whether the sidebar is collapsed.
 * @param {Function} options.handleCollapse - Callback function for handling the collapse action.
 * @param {Object} options.dimmensions - The dimensions of various elements.
 * @param {string} options.buttonClasses - Additional CSS classes for the button.
 * @param {boolean} options.buttonDefaultClasses - Flag indicating whether to include default CSS classes for the button.
 * @param {Object} options.buttonStyle - Additional inline styles for the button.
 * @param {boolean} options.buttonDefaultStyles - Flag indicating whether to include default inline styles for the button.
 * @returns {JSX.Element} - The rendered collapsible button component.
 */
const CollapsButton = ({ options }) => {
  const {
    layout = 'right',
    sidebarWidth = '450',
    isSidebarCollapsed = false,
    handleCollapse = () => {},
    dimmensions = {},
    buttonClasses = '',
    buttonDefaultClasses = true,
    buttonStyle = {},
    buttonDefaultStyles = true
  } = options;

  // If layout is neither 'right' nor 'left', return null to render nothing.
  if (layout !== 'right' && layout !== 'left') {
    return null;
  }

  // Calculate the button width based on the sidebar state and dimensions.
  const buttonWidth = isSidebarCollapsed ? 100 - (dimmensions.buttonWidth / 2) : sidebarWidth - (dimmensions.buttonWidth / 2);

  // Calculate the position of the button based on the layout and button width.
  const position = layout === 'right' ? { left: `${buttonWidth}px` } : { right: `${buttonWidth}px` };

  // Set default classes and styles for the button if specified.
  const defaultClasses = buttonDefaultClasses ? 'items-center justify-center hidden lg:flex bg-white absolute overflow-hidden rounded-full' : '';
  const defaultStyles = buttonDefaultStyles ? { width: '52px', height: '52px', boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.2)', top: '55px' } : {};

  let icon;
  if (layout === 'right') {
    icon = isSidebarCollapsed ? IconChevronRight : IconChevronLeft;
  } else if (layout === 'left') {
    icon = isSidebarCollapsed ? IconChevronLeft : IconChevronRight;
  }

  return (
    <button
      id="collasp-button"
      className={`${defaultClasses}${GetAttribute(buttonClasses)}`}
      style={{ ...defaultStyles, ...position, ...buttonStyle }}
      type="button"
      onClick={handleCollapse}
    >
      <SVG
        src={icon}
        alt="Minimize"
      />
    </button>
  );
};

export default CollapsButton;
