import React, { useEffect, useState } from 'react';

const Toggle = ({ triggerFunction, field, className }) => {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    triggerFunction(toggle, field);
  }, [toggle]);

  return (
    <button
      type="button"
      onClick={() => setToggle(!toggle)}
      className={`h-4 w-8 relative rounded-full ${
        toggle ? 'bg-green-light' : 'bg-gray'
      } ${className}`}
    >
      <div
        style={{ padding: '1px' }}
        className={`h-4 w-4 absolute bg-transparent rounded-full pin-t ${
          toggle ? 'pin-r shadow' : 'pin-l'
        }`}
      >
        <div className=" h-full w-full bg-white rounded-full" />
      </div>
    </button>
  );
};

export default Toggle;
