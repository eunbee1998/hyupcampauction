import React, { useEffect, useState } from "react";

function AuctionPage({ user, isAdmin }) {
  const [timer, setTimer] = useState(15);
  const [bid, setBid] = useState("");
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleBid = () => {
    const value = parseInt(bid);
    if (!isNaN(value)) {
      const newBids = [...bids, { user, value }];
      setBids(newBids.slice(-5));
      setTimer(15);
    }
    setBid("");
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 2fr 1fr",
      gap: "20px",
      padding: "40px"
    }}>
      <div>
        <h3>🧑‍🤝‍🧑 팀 구성</h3>
        <ul><li>팀 구성 현황판 표시 예정</li></ul>
      </div>
      <div style={{ textAlign: "center" }}>
        <h1>🔥 경매 진행 중 🔥</h1>
        <h2 style={{ color: "red" }}>타이머: {timer}초</h2>
        <input
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          placeholder="입찰 금액"
        />
        <button onClick={handleBid}>입찰</button>
        <h3>최근 입찰</h3>
        <ul>
          {bids.map((b, idx) => (
            <li key={idx}>{b.user}: {b.value} 포인트</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>🎴 선수 카드</h3>
        <img src="/images/cards/sample.png" alt="카드" style={{ width: "100%" }} />
      </div>
    </div>
  );
}

export default AuctionPage;
