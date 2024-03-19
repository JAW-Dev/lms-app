import React from 'react';

/**
 * UserAvatar component displays a user's avatar image or their initials as a fallback.
 * @param {Object} options - Options for configuring the user avatar.
 * @param {string} options.className - Additional CSS class name(s) to apply to the user avatar container.
 * @param {string} options.avatarUrl - URL of the user's avatar image.
 * @param {string} options.firstName - User's first name.
 * @param {string} options.lastName - User's last name.
 * @param {boolean} options.useLastInitial - Whether to use the last initial or not. Default is false.
 * @returns {JSX.Element} UserAvatar component.
 */
const UserAvatar = ({ options }) => {
  let { className, style, avatarUrl, firstName, lastName, useLastInitial = true } = options;

  // Check if the avatar URL exists and is not a default image
  const hasSavedImage = !!avatarUrl && !avatarUrl?.includes('blank-');

  /**
   * Returns the initials of the user.
   * @param {string} firstName - User's first name.
   * @param {string} lastName - User's last name.
   * @returns {string} User's initials in uppercase.
   */
  const getInitials = (firstName, lastName) => {
    if (useLastInitial) {
      return firstName.charAt(0) + lastName.charAt(0);
    }
    return firstName.charAt(0);
  };

  if (hasSavedImage) {
    style = {
      borderRadius: '100%',
      width: '80px',
      height: '80px'
    };
  }

  return (
    <div className={`user-avatar ${className}`} style={style}>
      {hasSavedImage && (
        <img
          className="user-avatar__image"
          src={avatarUrl}
          alt={`${firstName} ${lastName}`}
        />
      )}
      {!hasSavedImage && (
        <div className="user-avatar__default flex items-center justify-center" style={style}>
          <span className="user-avatar__default-text">
            {getInitials(firstName, lastName)}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
