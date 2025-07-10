
import React from 'react';

function TeamBoard({ team }) {
  return (
    <div style={{ marginTop: '30px' }}>
      <h2>📊 팀 현황</h2>
      <ul>
        {Object.entries(team).map(([position, player]) => (
          <li key={position}>{position}: {player}</li>
        ))}
      </ul>
    </div>
  );
}

export default TeamBoard;
