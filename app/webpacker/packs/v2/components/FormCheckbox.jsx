import React, { useState } from 'react';

const FormCheckbox = ({ label, name, checked, onChange, classes }) => {
  return (
    <label htmlFor={name} className="custom-checkbox-container">
      {label}
      <input
				id={name}
				name={name}
				className={classes}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="custom-checkbox"></span>
    </label>
  );
};

export default FormCheckbox;