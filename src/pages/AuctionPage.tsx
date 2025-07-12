import React, { useEffect, useState, useRef } from "react";

const AuctionPage = () => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [bidAmount, setBidAmount] = useState("");
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBid = () => {
    const bid = parseInt(bidAmount);
    if (!isNaN(bid) && (highestBid === null || bid > highestBid)) {
      setHighestBid(bid);
      startTimer(); // 입찰 시 타이머 초기화
    }
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>경매 페이지</h1>
      <h2>남은 시간: {timeLeft}초</h2>
      <h2>현재 최고 입찰가: {highestBid ?? "없음"}</h2>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="입찰 금액 입력"
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      />
      <button
        onClick={handleBid}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem", fontSize: "1rem" }}
      >
        입찰
      </button>
    </div>
  );
};

export default AuctionPage;