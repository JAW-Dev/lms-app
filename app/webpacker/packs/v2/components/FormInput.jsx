import React, { useState } from 'react';
import SVG from 'react-inlinesvg';

const FormInput = ({ label, handleChange, type, name, value, icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div style={{ gap: '0' }} className="flex flex-col">
      {label && (
      <label className="text-sm text-charcoal font-bold pb-2">
        {label}
      </label>
      )}
      <div
        className={`px-2 py-2 flex items-center border-2 ${
          isFocused && ' border-purple'
        }`}
        style={{borderRadius: '12px', minWidth: '100%'}}
      >
        {icon && <SVG className="mr-4" src={icon} />}
        <input
          className="focus:outline-none w-full"
          type={type}
          name={name}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
export default FormInput;
