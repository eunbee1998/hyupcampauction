
import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import TeamBoard from './TeamBoard';
import { parseCardFileName } from '../utils/auctionLogic';

const dummyCards = [
  "01_선수1_TOP.png", "02_선수2_JUG.png", "03_선수3_MID.png", "04_선수4_ADC.png", "05_선수5_SUP.png",
  "06_선수6_TOP.png", "07_선수7_JUG.png", "08_선수8_MID.png", "09_선수9_ADC.png", "10_선수10_SUP.png",
  "11_선수11_TOP.png", "12_선수12_JUG.png", "13_선수13_MID.png", "14_선수14_ADC.png", "15_선수15_SUP.png",
  "16_선수16_TOP.png", "17_선수17_JUG.png", "18_선수18_MID.png", "19_선수19_ADC.png", "20_선수20_SUP.png"
];

function Auction({ teamManagers, budgets }) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isRunning, setIsRunning] = useState(true);
  const [bid, setBid] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [teamBoards, setTeamBoards] = useState(teamManagers.map(() => ({})));
  const [teamBudgets, setTeamBudgets] = useState([...budgets]);
  const [activeTeam, setActiveTeam] = useState(0); // 0~3 순번

  const currentCard = dummyCards[currentIndex];
  const { name, position } = parseCardFileName(currentCard);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      alert("⛔ 유찰되었습니다.");
      goToNextCard();
    }
  }, [isRunning, timeLeft]);

  const handleBid = () => {
    if (bid > 0 && bid <= teamBudgets[activeTeam]) {
      alert(`✅ ${teamManagers[activeTeam]}팀이 ${bid} 포인트로 ${name}(${position}) 입찰!`);
      const updatedBoards = [...teamBoards];
      updatedBoards[activeTeam][position] = name;
      setTeamBoards(updatedBoards);

      const updatedBudgets = [...teamBudgets];
      updatedBudgets[activeTeam] -= bid;
      setTeamBudgets(updatedBudgets);

      goToNextCard();
    }
  };

  const goToNextCard = () => {
    setTimeLeft(15);
    setBid(0);
    setCurrentIndex(prev => prev + 1);
    setActiveTeam((prev) => (prev + 1) % 4);
    setIsRunning(true);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>현재 팀장: {teamManagers[activeTeam]}</h2>
      <Timer timeLeft={timeLeft} />
      <img
        src={`${process.env.PUBLIC_URL}/images/${currentCard}`}
        alt={name}
        style={{ width: '250px', margin: '20px', borderRadius: '10px' }}
      />
      <p>{name} / {position}</p>
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(Number(e.target.value))}
        placeholder="입찰 금액"
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={handleBid} disabled={bid <= 0 || bid > teamBudgets[activeTeam]}>
        입찰하기
      </button>
      <p>💰 남은 포인트: {teamBudgets[activeTeam]}</p>
      <TeamBoard team={teamBoards[activeTeam]} manager={teamManagers[activeTeam]} />
    </div>
  );
}

export default Auction;
