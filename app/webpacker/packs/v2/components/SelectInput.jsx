import React from 'react';

const SelectInput = ({ name, value, options, onChange, className }) => {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className="custom-select border-2 border-gray rounded-lg p-4"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
