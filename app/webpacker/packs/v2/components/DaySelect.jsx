import React, { useEffect } from 'react';

function DaySelect({ selectedDay, setSelectedDay }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // add "i + 1" to get the date for next 30 days
    return {
      value: d.toISOString().split('T')[0], // get the date in YYYY-MM-DD format
      label: d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }), // get the date in "Tuesday, June 26" format
    };
  });

  // set default day to next day when selectedDay is null
  useEffect(() => {
    if (selectedDay === '' || selectedDay === null) {
      setSelectedDay(days[0].value);
    }
  }, [selectedDay, setSelectedDay, days]);

  return (
    <select
      id="day"
      value={selectedDay}
      onChange={(e) => setSelectedDay(e.target.value)}
      className="block w-full px-4 py-2 border-2 border-gray focus:outline-none focus:border-link-purple rounded-lg appearance-none"
    >
      {days.map((day) => (
        <option key={day.value} value={day.value}>
          {day.label}
        </option>
      ))}
    </select>
  );
}

export default DaySelect;
