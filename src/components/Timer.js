
import React from 'react';

function Timer({ timeLeft }) {
  return (
    <div style={{ fontSize: '32px', fontWeight: 'bold', color: timeLeft <= 5 ? 'red' : 'black' }}>
      ⏱️ {timeLeft}초 남음
    </div>
  );
}

export default Timer;
