
import React, { useState } from 'react';
import AuctionTimer from './components/AuctionTimer';

function App() {
  const [key, setKey] = useState(0);

  const handleBid = () => {
    alert('입찰이 감지되었습니다! 타이머 초기화!');
    setKey(prev => prev + 1); // 타이머 강제 초기화
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Hyupcamp 입찰 타이머 테스트</h1>
      <AuctionTimer key={key} duration={15} />
      <button onClick={handleBid} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
        💸 입찰
      </button>
    </div>
  );
}

export default App;
