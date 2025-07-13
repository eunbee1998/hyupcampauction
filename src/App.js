
import React, { useState } from "react";
import AuctionTimer from "./components/AuctionTimer";
import BidInput from "./components/BidInput";

function App() {
  const [highestBid, setHighestBid] = useState(0);
  const [lastBidTime, setLastBidTime] = useState(null);
  const [winner, setWinner] = useState("");

  const handleBidSubmit = (amount) => {
    if (amount > highestBid) {
      setHighestBid(amount);
      setLastBidTime(Date.now());
      setWinner("팀장"); // 실제 팀장 이름으로 대체 필요
    }
  };

  const handleTimeout = () => {
    alert(`낙찰! ${winner}님이 ${highestBid} 포인트에 선수 영입`);
    setHighestBid(0);
    setWinner("");
    setLastBidTime(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>롤 팀 구성 경매 프로그램</h1>
      <AuctionTimer duration={15} onTimeout={handleTimeout} lastBidTime={lastBidTime} />
      <h2>현재 최고 입찰가: {highestBid} 포인트</h2>
      <BidInput onBidSubmit={handleBidSubmit} />
      {winner && <h3>현재 최고 입찰자: {winner}</h3>}
    </div>
  );
}

export default App;
