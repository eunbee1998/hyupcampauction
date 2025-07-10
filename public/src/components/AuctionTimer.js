
import React, { useEffect, useState } from 'react';

function AuctionTimer({ duration }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div style={{
      fontSize: '32px',
      fontWeight: 'bold',
      color: timeLeft <= 5 ? 'red' : 'black'
    }}>
      ⏳ {timeLeft}초 남음
    </div>
  );
}

export default AuctionTimer;
