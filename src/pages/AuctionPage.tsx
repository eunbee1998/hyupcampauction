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
  const [recentBids, setRecentBids] = useState<any[]>([]);
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

  const changeBidAmount = (delta: number) => {
    setBidAmount((prev) => Math.max(0, prev + delta));
  };

  const handleBid = async () => {
    if (bidAmount > 0 && (highestBid === null || bidAmount > highestBid)) {
      await addDoc(collection(db, "auction", "bids", "entries"), {
        bidder: username,
        amount: bidAmount,
        timestamp: serverTimestamp()
      });
    }
  };

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
        const top = Math.max(...bids.map((b: any) => b.amount));
        if (top !== highestBid) {
          setHighestBid(top);
          startTimer();
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
      <h2>현재 최고 입찰가: {highestBid ?? "없음"}</h2>
      <h3>입찰 금액: {bidAmount}P</h3>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => changeBidAmount(-100)}>-100</button>
        <button onClick={() => changeBidAmount(-50)} style={{ margin: "0 10px" }}>-50</button>
        <button onClick={() => changeBidAmount(-10)}>-10</button>
        <button onClick={() => changeBidAmount(10)} style={{ marginLeft: "10px" }}>+10</button>
        <button onClick={() => changeBidAmount(50)} style={{ margin: "0 10px" }}>+50</button>
        <button onClick={() => changeBidAmount(100)}>+100</button>
      </div>
      <button
        onClick={handleBid}
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