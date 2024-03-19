import React, { useState } from 'react';
import SVG from 'react-inlinesvg';
import classNames from 'classnames';
import IconSearch from '../../../../assets/images/reskin-images/icon--search.svg';
import IconX from '../../../../assets/images/reskin-images/icon--x.svg';

const SearchInput = ({ searchQuery, setSearchQuery, className, active }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={classNames(
        'px-4 py-3 flex items-center bg-white-faint rounded-2lg border-2',
        className, {
          'border-purple bg-white': active || isFocused,
          'bg-white-faint': !active && !isFocused
        })}
    >
      <SVG
        src={IconSearch}
        className={classNames('mr-2 search-input-icon', { 'search-input-icon--active': active || isFocused })}
      />
      <input
        className={classNames('focus:outline-none', { 'bg-white-faint': !active && !isFocused, 'bg-white': active || isFocused })}
        type="text"
        id="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search"
      />

      {active && searchQuery !== '' && (
        <button type="button" onClick={() => setSearchQuery('')}>
          <SVG src={IconX} />
        </button>
      )}
    </div>
  );
};
export default SearchInput;
