
import React, { useState } from 'react';
import './LayoutAuction.css';

function LayoutAuction() {
  const [bidAmount, setBidAmount] = useState(0);

  const handleBidChange = (delta) => {
    setBidAmount(prev => Math.max(prev + delta, 0));
  };

  const submitBid = () => {
    alert(`입찰 제출: ${bidAmount} 포인트`);
    // 실제 Firebase에 저장하는 로직은 이곳에 추가됩니다.
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="team-box"><div className="team-title">🔵 뉴칼라의 팀</div>포인트: 1000</div>
        <div className="team-box"><div className="team-title">🔴 정한 팀</div>포인트: 1000</div>
        <div className="team-box"><div className="team-title">🟢 코릿 팀</div>포인트: 1000</div>
        <div className="team-box"><div className="team-title">🟡 크로 팀</div>포인트: 1000</div>
      </div>
      <div className="main">
        <h1>Hyupcamp 자낳대 경매</h1>
        <div className="timer">TIME COUNT: 15.00</div>
        <div className="center-panel">
          <div>입찰 금액</div>
          <input type="number" value={bidAmount} readOnly />
          <div className="bid-buttons">
            <button onClick={() => handleBidChange(5)}>+5</button>
            <button onClick={() => handleBidChange(10)}>+10</button>
            <button onClick={() => handleBidChange(50)}>+50</button>
            <button onClick={() => handleBidChange(100)}>+100</button>
            <button className="submit" onClick={submitBid}>제출</button>
          </div>
        </div>
      </div>
      <div className="rightbar">
        <h3>포지션별 선수</h3>
        <div className="player-grid">
          <div className="player-icon">TOP1</div><div className="player-icon">JUG1</div>
          <div className="player-icon">MID1</div><div className="player-icon">ADC1</div><div className="player-icon">SUP1</div>
        </div>
        <div className="player-grid">
          <div className="player-icon">TOP2</div><div className="player-icon">JUG2</div>
          <div className="player-icon">MID2</div><div className="player-icon">ADC2</div><div className="player-icon">SUP2</div>
        </div>
        <h3 style={{ marginTop: '20px' }}>📢 채팅 로그</h3>
        <div className="chat-box">
          🔔 뉴칼라가 500 입찰했습니다<br/>
          🔔 정한이 550 입찰했습니다<br/>
        </div>
      </div>
    </div>
  );
}

export default LayoutAuction;
