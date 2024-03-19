import React from 'react';

const SimplifiedTable = ({ data, checkedItems, setCheckedItems }) => {
  const handleItemChecked = (itemId, itemEmail) => {
    const itemIndex = checkedItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      setCheckedItems(checkedItems.filter((item) => item.id !== itemId));
    } else {
      setCheckedItems([...checkedItems, { id: itemId, email: itemEmail }]);
    }
  };

  return (
    <div
      style={{ maxHeight: '400px', gap: '8px' }}
      className="flex flex-col overflow-y-scroll p-4 border-2 border-gray rounded-2lg"
    >
      {data.map((item) => {
        const checked = checkedItems.some(
          (checkedItem) => checkedItem.id === item.id
        );
        return (
          <div key={item.id} className="flex items-center mb-2">
            <input
              id={item.id}
              type="checkbox"
              value={item.id}
              checked={checked}
              onChange={() => handleItemChecked(item.id, item.email)}
              className="ml-2 mr-4"
            />
            <label htmlFor={item.id} className=" ">{item.email}</label>
          </div>
        );
      })}
    </div>
  );
};

export default SimplifiedTable;
