// components/Alarm.js
import React, { useEffect } from 'react';
import SVG from 'react-inlinesvg';
import { motion } from 'framer-motion/dist/framer-motion';
import useAlarm from '../context/AlarmContext';

import CircleXIcon from '../../../../assets/images/reskin-images/icon--circle-x.svg';
import CircleCheckIcon from '../../../../assets/images/reskin-images/icon--circle-check.svg';

const Alarm = () => {
  const { alarm, setAlarm } = useAlarm();

  useEffect(() => {
    if (alarm) {
      const timer = setTimeout(() => {
        setAlarm(null);
      }, 10000); // Hide the alarm after 5 seconds

      return () => {
        clearTimeout(timer);
      };
    }
  }, [alarm, setAlarm]);

  if (!alarm) {
    return null;
  }

  const type = {
    success: 'bg-green-lightest',
    error: 'bg-red-lightest'
  };

  return (
    <motion.div
      onClick={() => setAlarm(null)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{ bottom: '100px', right: '150px', zIndex: '999999' }}
      className={` alarm p-4 rounded-lg flex  font-semibold items-center fixed ${
        type[alarm.type]
      }`}
    >
      <SVG
        className="mr-4"
        src={alarm.type === 'success' ? CircleCheckIcon : CircleXIcon}
      />
      {alarm.message}
    </motion.div>
  );
};

export default Alarm;
