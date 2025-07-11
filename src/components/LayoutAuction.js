
import React from 'react';
import './LayoutAuction.css';

function LayoutAuction() {
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
          <input type="number" />
          <div className="bid-buttons">
            <button>+5</button><button>+10</button><button>+50</button><button>+100</button>
            <button className="submit">제출</button>
          </div>
        </div>
      </div>
      <div className="rightbar">
        <h3>포지션별 선수</h3>
        <div className="player-grid">
          <div className="player-icon">TOP1</div><div className="player-icon">JUG1</div><div className="player-icon">MID1</div><div className="player-icon">ADC1</div><div className="player-icon">SUP1</div>
        </div>
        <div className="player-grid">
          <div className="player-icon">TOP2</div><div className="player-icon">JUG2</div><div className="player-icon">MID2</div><div className="player-icon">ADC2</div><div className="player-icon">SUP2</div>
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
