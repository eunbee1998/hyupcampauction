
import React, { useEffect, useState } from "react";

const AuctionTimer = ({ duration = 15, onTimeout, lastBidTime }) => {
  const [remaining, setRemaining] = useState(duration);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    if (lastBidTime) {
      const elapsed = Math.floor((Date.now() - lastBidTime) / 1000);
      const newRemaining = Math.max(duration - elapsed, 0);
      setRemaining(newRemaining);
    }
  }, [lastBidTime, duration]);

  useEffect(() => {
    if (remaining === 0) {
      onTimeout();
      return;
    }

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerId(id);
    return () => clearInterval(id);
  }, [remaining]);

  return (
    <div style={{ fontSize: "2rem", color: "red" }}>
      ⏱ 남은 시간: {remaining}s
    </div>
  );
};

export default AuctionTimer;
