
import React, { useState, useEffect } from 'react';

function Auction({ teamManager }) {
  const [bid, setBid] = useState(0);
  const [highestBid, setHighestBid] = useState({ name: '', amount: 0 });
  const [timeLeft, setTimeLeft] = useState(15);
  const [lastBidder, setLastBidder] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert(`⏱️ 경매 종료! 낙찰자: ${highestBid.name}, 금액: ${highestBid.amount}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [highestBid]);

  const handleBid = () => {
    if (bid > highestBid.amount) {
      setHighestBid({ name: teamManager, amount: bid });
      setLastBidder(teamManager);
      setTimeLeft(15); // 입찰 시 타이머 초기화
    } else {
      alert('현재 최고 입찰가보다 높아야 합니다.');
    }
    setBid(0);
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>경매 입찰 화면</h1>
      <h2>접속 팀장: {teamManager}</h2>
      <h3>⏳ 남은 시간: {timeLeft}초</h3>
      <p>💰 현재 최고 입찰가: {highestBid.amount} / 입찰자: {highestBid.name}</p>
      <input
        type="number"
        placeholder="입찰 금액 입력"
        value={bid}
        onChange={(e) => setBid(Number(e.target.value))}
        style={{ padding: '8px', fontSize: '16px' }}
      />
      <button onClick={handleBid} style={{ marginLeft: '10px', padding: '8px 16px' }}>
        입찰하기
      </button>
    </div>
  );
}

export default Auction;
