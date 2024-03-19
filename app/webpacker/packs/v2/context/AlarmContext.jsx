// context/AlarmContext.js
import React, { createContext, useContext, useState } from 'react';

const AlarmContext = createContext();

const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};

export const AlarmProvider = ({ children }) => {
  const [alarm, setAlarm] = useState(null);

  return (
    <AlarmContext.Provider value={{ alarm, setAlarm }}>
      {children}
    </AlarmContext.Provider>
  );
};

export default useAlarm;
