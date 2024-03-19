import React from 'react';
import { motion } from 'framer-motion/dist/framer-motion';

const LoadingDot = {
  display: 'block',
  width: '1rem',
  height: '1rem',
  backgroundColor: 'black',
  borderRadius: '50%'
};

const LoadingContainer = {
  width: '5rem',
  height: '2rem',
  display: 'flex',
  justifyContent: 'space-around'
};

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2
    }
  },
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const DotVariants = {
  initial: {
    y: '0%'
  },
  animate: {
    y: '100%'
  }
};

const DotTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: 'easeInOut'
};

const ThreeDotsWave = () => (
  <div className="w-full flex items-center justify-center p-10">
    <motion.div
      style={LoadingContainer}
      variants={ContainerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.span
        style={LoadingDot}
        variants={DotVariants}
        transition={DotTransition}
      />
      <motion.span
        style={LoadingDot}
        variants={DotVariants}
        transition={DotTransition}
      />
      <motion.span
        style={LoadingDot}
        variants={DotVariants}
        transition={DotTransition}
      />
    </motion.div>
  </div>
);

const FormLoader = () => {
  const loaderVariants = {
    start: {
      scale: 1,
      opacity: 1
    },
    end: {
      scale: 1.5,
      opacity: 0
    }
  };

  const loaderTransition = {
    duration: 0.75,
    yoyo: Infinity
  };

  return (
    <div
      style={{ background: 'rgba(255,255,255, 0.86)', zIndex: '999999' }}
      className="loader-wrapper w-full h-full flex items-center justify-center fixed pin-t pin-l flex-col"
    >
      <ThreeDotsWave />
      <p className=" font-semibold">Working on your request.</p>
      <p className=" font-semibold">Please do not refresh page.</p>
    </div>
  );
};

export default FormLoader;
