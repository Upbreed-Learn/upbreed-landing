import { useState, useEffect, useRef } from 'react';

const useTimer = (initialTime = 60) => {
  const [seconds, setSeconds] = useState(initialTime);
  const [timerRunning, setTimerRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartTimer = () => {
    // if (timerRunning) return;

    setSeconds(initialTime); // reset to initial time
    setTimerRunning(true);
  };

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, initialTime]);

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(
    2,
    '0',
  )}:${String(seconds % 60).padStart(2, '0')}`;

  return { formattedTime, handleStartTimer, timerRunning };
};

export default useTimer;
