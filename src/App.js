
import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import TeamBoard from './components/TeamBoard';
import { parseCardFileName } from './utils/auctionLogic';

const dummyCards = [
  "01_김철수_TOP.png",
  "02_이영희_JUG.png",
  "03_박민수_MID.png",
  "04_최지우_ADC.png",
  "05_조민호_SUP.png"
];

function App() {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isRunning, setIsRunning] = useState(true);
  const [budget, setBudget] = useState(5000);
  const [bid, setBid] = useState(0);
  const [team, setTeam] = useState({});

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      alert("⛔ 유찰되었습니다.");
    }
  }, [isRunning, timeLeft]);

  const handleBid = () => {
    if (bid > 0 && bid <= budget) {
      alert(`✅ ${bid} 포인트로 입찰 완료!`);
      setBudget(budget - bid);
      setTimeLeft(15);
      setIsRunning(true);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Hyupcamp 경매 시스템</h1>
      <Timer timeLeft={timeLeft} />
      <input
        type="number"
        placeholder="입찰 금액"
        value={bid}
        onChange={(e) => setBid(Number(e.target.value))}
        style={{ fontSize: '16px', padding: '8px', marginTop: '10px' }}
      />
      <button
        onClick={handleBid}
        style={{ marginLeft: '10px', fontSize: '16px', padding: '8px' }}
        disabled={!isRunning || bid > budget}
      >
        입찰하기
      </button>
      <p>💰 남은 예산: {budget} 포인트</p>
      <TeamBoard team={team} />
    </div>
  );
}

export default App;
