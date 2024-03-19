import { useEffect } from 'react';

function useStopScrolling(isStopScrolling) {
  useEffect(() => {
    const originalOverflow = window.getComputedStyle(document.body).overflow;

    if (isStopScrolling) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isStopScrolling]);
}

export default useStopScrolling;
