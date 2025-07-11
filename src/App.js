
import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import TeamBoard from './components/TeamBoard';
import { parseCardFileName } from './utils/auctionLogic';

const dummyCards = [
  "01_선수1_TOP.png",
  "02_선수2_JUG.png",
  "03_선수3_MID.png",
  "04_선수4_ADC.png",
  "05_선수5_SUP.png",
  "06_선수6_TOP.png",
  "07_선수7_JUG.png",
  "08_선수8_MID.png",
  "09_선수9_ADC.png",
  "10_선수10_SUP.png",
  "11_선수11_TOP.png",
  "12_선수12_JUG.png",
  "13_선수13_MID.png",
  "14_선수14_ADC.png",
  "15_선수15_SUP.png",
  "16_선수16_TOP.png",
  "17_선수17_JUG.png",
  "18_선수18_MID.png",
  "19_선수19_ADC.png",
  "20_선수20_SUP.png"
];

function App() {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isRunning, setIsRunning] = useState(true);
  const [budget, setBudget] = useState(5000);
  const [bid, setBid] = useState(0);
  const [team, setTeam] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = dummyCards[currentIndex];
  const { name, position } = parseCardFileName(currentCard);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      alert("⛔ 유찰되었습니다.");
      goToNextCard();
    }
  }, [isRunning, timeLeft]);

  const handleBid = () => {
    if (bid > 0 && bid <= budget) {
      alert(`✅ ${bid} 포인트로 ${name}(${position}) 입찰 완료!`);
      setBudget(budget - bid);
      setTeam(prev => ({ ...prev, [position]: name }));
      goToNextCard();
    }
  };

  const goToNextCard = () => {
    setBid(0);
    setTimeLeft(15);
    setIsRunning(true);
    setCurrentIndex(prev => (prev + 1) % dummyCards.length);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Hyupcamp 경매 시스템</h1>
      <Timer timeLeft={timeLeft} />
      <div style={{ margin: '20px auto' }}>
        <img
          src={`${process.env.PUBLIC_URL}/images/${currentCard}`}
          alt={name}
          style={{ width: '250px', height: '375px', borderRadius: '10px', border: '2px solid #ccc' }}
        />
        <p style={{ fontSize: '20px', marginTop: '10px' }}>{name} / {position}</p>
      </div>
      <input
        type="number"
        placeholder="입찰 금액"
        value={bid}
        onChange={(e) => setBid(Number(e.target.value))}
        style={{ fontSize: '16px', padding: '8px' }}
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
