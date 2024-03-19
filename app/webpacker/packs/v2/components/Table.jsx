import React from 'react';

const Table = ({
  id,
  data,
  columns,
  reconstructorFn,
  checkedItems,
  setCheckedItems,
  setRowHovered,
}) => {
  const handleItemChecked = (itemId, itemEmail) => {
    const itemIndex = checkedItems.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      setCheckedItems(checkedItems.filter((item) => item.id !== itemId));
    } else {
      setCheckedItems([...checkedItems, { id: itemId, email: itemEmail }]);
    }
  };

  const handleCheckAll = (event) => {
    if (event.target.checked) {
      const newCheckedItems = data
        .filter(
          (item) =>
            !checkedItems.some((checkedItem) => checkedItem.id === item.id)
        )
        .map((item) => ({ id: item.id, email: item.email }));

      setCheckedItems([...checkedItems, ...newCheckedItems]);
    } else {
      const remainingCheckedItems = checkedItems.filter(
        (checkedItem) => !data.map((item) => item.id).includes(checkedItem.id)
      );
      setCheckedItems(remainingCheckedItems);
    }
  };

  const countCheckedItemsOnCurrentPage = () => {
    return data.reduce((count, item) => {
      if (checkedItems.some((checkedItem) => checkedItem.id === item.id)) {
        return count + 1;
      }
      return count;
    }, 0);
  };
  return (
    <table className="react-table w-full rounded-lg overflow-hidden">
      <thead className="bg-white-faint">
        <tr>
          <th style={{ width: '96px' }} className="checkbox-container">
            <label htmlFor={`${id}-check-all`}>
              <input
                id={`${id}-check-all`}
                type="checkbox"
                checked={
                  countCheckedItemsOnCurrentPage() === data.length &&
                  data.length > 0
                }
                onChange={handleCheckAll}
              />
            </label>
          </th>
          {columns.map((col) => {
            return (
              <th
                style={{ width: col.width }}
                className={`font-normal text-charcoal  text-${col.textAlign}`}
                key={crypto.randomUUID()}
              >
                {col.label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((curr) => {
          const row = reconstructorFn(curr);
          const checked = checkedItems.some(
            (checkedItem) => checkedItem.id === row.id
          );
          return (
            <tr
              style={{ width: '96px' }}
              className={checked && 'bg-purple-100'}
              key={crypto.randomUUID()}
              onMouseEnter={() => setRowHovered && setRowHovered(row.id)}
              onMouseLeave={() => setRowHovered && setRowHovered()}
            >
              <td className="text-center checkbox-container">
                <label htmlFor={row.id}>
                  <input
                    id={row.id}
                    type="checkbox"
                    value={row.id}
                    checked={checked}
                    onChange={() => handleItemChecked(row.id, row.email)} // Pass both id and email
                  />
                </label>
              </td>
              {columns.map((col) => (
                <td
                  className={`relative text-${col.textAlign} font-${col.fontWeight}`}
                  key={crypto.randomUUID()}
                >
                  {row[col.field]}{' '}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
