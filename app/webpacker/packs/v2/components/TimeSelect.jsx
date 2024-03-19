import React from 'react';

export default function TimeSelect({ selectedTime, setSelectedTime }) {
  const times = [];
  for (let i = 0; i <= 23.5; i += 0.5) {
    const hour = Math.floor(i);
    const minutes = i - hour > 0 ? '30' : '00';

    let displayHour = hour > 12 ? hour - 12 : hour;
    displayHour = displayHour === 0 ? 12 : displayHour; // Adjust for zero hour
    const period = hour >= 12 ? 'PM' : 'AM';

    const displayTime = `${displayHour}:${minutes} ${period}`;
    const valueTime = `${hour.toString().padStart(2, '0')}:${minutes}`;

    times.push({ display: displayTime, value: valueTime });
  }

  const handleSelectChange = (e) => {
    setSelectedTime(e.target.value);
  };

  return (
    <select
      value={selectedTime}
      onChange={handleSelectChange}
      className="block w-full px-4 py-2 border-2 border-gray focus:outline-none focus:border-link-purple rounded-lg appearance-none custom-select--arrow"
    >
      {times.map((time) => (
        <option key={time.value} value={time.value}>
          {time.display}
        </option>
      ))}
    </select>
  );
}
