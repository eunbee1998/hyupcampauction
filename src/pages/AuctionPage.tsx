import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";

const AuctionPage = ({ username }: { username: string }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [topBidder, setTopBidder] = useState<string | null>(null);
  const [recentBids, setRecentBids] = useState<any[]>([]);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const disableBid = username === topBidder || auctionEnded;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(15);
    setAuctionEnded(false);
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

  const changeBidAmount = (delta: number) => {
    setBidAmount((prev) => Math.max(0, prev + delta));
  };

  const handleBid = async () => {
    if (disableBid) return;
    if (bidAmount > 0 && (highestBid === null || bidAmount > highestBid)) {
      await addDoc(collection(db, "auction", "bids", "entries"), {
        bidder: username,
        amount: bidAmount,
        timestamp: serverTimestamp()
      });
    }
  };

  // 낙찰 처리
  useEffect(() => {
    if (timeLeft === 0 && !auctionEnded && topBidder && highestBid !== null) {
      setAuctionEnded(true);
      addDoc(collection(db, "auction", "results", "entries"), {
        winner: topBidder,
        amount: highestBid,
        timestamp: serverTimestamp()
      });
    }
  }, [timeLeft, auctionEnded, topBidder, highestBid]);

  // 실시간 입찰 내역
  useEffect(() => {
    const q = query(
      collection(db, "auction", "bids", "entries"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bids = snapshot.docs.map((doc) => doc.data());
      setRecentBids(bids);
      if (bids.length > 0) {
        const top = bids.reduce((prev: any, curr: any) =>
          curr.amount > prev.amount ? curr : prev
        );
        setHighestBid(top.amount);
        setTopBidder(top.bidder);
        if (top.amount !== highestBid) {
          startTimer(); // 입찰 시 타이머 초기화
        }
      }
    });

    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      unsubscribe();
    };
  }, [highestBid]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{username} 경매 페이지</h1>
      <h2>남은 시간: {timeLeft}초</h2>
      <h2>
        현재 최고 입찰가: {highestBid ?? "없음"} ({topBidder ?? "없음"})
      </h2>
      <h3>입찰 금액: {bidAmount}P</h3>

      {disableBid && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {auctionEnded
            ? "입찰이 종료되었습니다. 낙찰 처리됨."
            : "현재 최고 입찰자는 입찰할 수 없습니다."}
        </p>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => changeBidAmount(-100)} disabled={disableBid}>-100</button>
        <button onClick={() => changeBidAmount(-50)} style={{ margin: "0 10px" }} disabled={disableBid}>-50</button>
        <button onClick={() => changeBidAmount(-10)} disabled={disableBid}>-10</button>
        <button onClick={() => changeBidAmount(10)} style={{ marginLeft: "10px" }} disabled={disableBid}>+10</button>
        <button onClick={() => changeBidAmount(50)} style={{ margin: "0 10px" }} disabled={disableBid}>+50</button>
        <button onClick={() => changeBidAmount(100)} disabled={disableBid}>+100</button>
      </div>

      <button
        onClick={handleBid}
        disabled={disableBid}
        style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
      >
        입찰
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h3>최근 입찰 내역</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recentBids.map((bid, idx) => (
            <li key={idx}>
              {bid.bidder} - {bid.amount}P
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuctionPage;