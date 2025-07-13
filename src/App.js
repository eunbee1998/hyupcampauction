
import React, { useState } from "react";
import AuctionTimer from "./components/AuctionTimer";
import BidInput from "./components/BidInput";
import LoginPage from "./LoginPage";

const initialPoints = {
  팀장1: 3000,
  팀장2: 3000,
  팀장3: 3000,
  팀장4: 3000
};

function App() {
  const [user, setUser] = useState(null);
  const [highestBid, setHighestBid] = useState(0);
  const [lastBidTime, setLastBidTime] = useState(null);
  const [winner, setWinner] = useState("");
  const [points, setPoints] = useState(initialPoints);

  const handleBidSubmit = (amount) => {
    if (amount > highestBid && user && points[user] >= amount) {
      setHighestBid(amount);
      setLastBidTime(Date.now());
      setWinner(user);
    } else if (points[user] < amount) {
      alert("보유 포인트보다 높은 금액은 입찰할 수 없습니다.");
    }
  };

  const handleTimeout = () => {
    if (winner) {
      alert(`낙찰! ${winner}님이 ${highestBid} 포인트에 선수 영입`);
      setPoints((prev) => ({
        ...prev,
        [winner]: prev[winner] - highestBid
      }));
    } else {
      alert("유찰되었습니다. 이 선수는 재경매로 넘어갑니다.");
    }
    setHighestBid(0);
    setWinner("");
    setLastBidTime(null);
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ position: "absolute", top: "10px", left: "10px", fontSize: "1.2rem" }}>
        👤 로그인: {user} / 보유 포인트: {user.startsWith("팀장") ? points[user] : "관리자"}
      </div>
      <h1>롤 팀 구성 경매 프로그램</h1>
      <AuctionTimer duration={15} onTimeout={handleTimeout} lastBidTime={lastBidTime} />
      <h2>현재 최고 입찰가: {highestBid} 포인트</h2>
      {user !== "관리자" && <BidInput onBidSubmit={handleBidSubmit} />}
      {winner && <h3>현재 최고 입찰자: {winner}</h3>}
    </div>
  );
}

export default App;
