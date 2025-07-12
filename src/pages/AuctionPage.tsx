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

const AuctionPage = () => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [bidAmount, setBidAmount] = useState("");
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

  const handleBid = async () => {
    const bid = parseInt(bidAmount);
    if (!isNaN(bid) && (highestBid === null || bid > highestBid)) {
      await addDoc(collection(db, "auction", "bids", "entries"), {
        bidder: "팀장1", // 실제 로그인 사용자명으로 대체 가능
        amount: bid,
        timestamp: serverTimestamp()
      });
      setBidAmount("");
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
          startTimer(); // 실시간으로 갱신될 때 타이머 초기화
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
      <h1>경매 페이지 (실시간)</h1>
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