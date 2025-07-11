
import React from 'react';

function Auction({ teamManager }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🎯 경매에 입장하셨습니다!</h1>
      <h2>팀장: {teamManager}</h2>
      <p>여기서 입찰 UI가 표시됩니다.</p>
    </div>
  );
}

export default Auction;
