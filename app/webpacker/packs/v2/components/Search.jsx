import React, { useState, useEffect, useRef } from 'react';
import SVG from 'react-inlinesvg';

import IconSearch from '../../../../assets/images/reskin-images/icon--search.svg';

export default function Search({ onSearch, placeHolder }) {
  const [inputValue, setInputValue] = useState('');
  const timer = useRef(null); // Use useRef instead of useState
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (inputValue && timer.current) {
      // Access the timer using .current
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      // Update the timer using .current
      if (inputValue) {
        onSearch(inputValue);
      }
    }, 1000);
    return () => {
      clearTimeout(timer.current); // Clear the timer using .current
    };
  }, [inputValue, onSearch]); // Remove timer from the dependency array

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div
      className={`flex items-center py-2 px-3 border ${
        focused ? 'border-link-purple' : 'border-gray-dark'
      } rounded-2lg`}
    >
      <SVG src={IconSearch} className={`mr-2 ${focused && 'active-icon'}`} />
      <input
        type="text"
        onChange={handleInputChange}
        value={inputValue}
        placeholder={placeHolder || 'Search...'}
        style={{
          maxWidth: '100%',
          width: '300px',
          transform: 'translateY(2px)',
        }}
        className="text-sm outline-none focus:outline-none active:outline-none "
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
