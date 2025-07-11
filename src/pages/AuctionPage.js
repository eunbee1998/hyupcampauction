
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot
} from "firebase/firestore";

function AuctionPage({ user, isAdmin }) {
  const [timer, setTimer] = useState(15);
  const [bid, setBid] = useState("");
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "auction/status"), (snapshot) => {
      snapshot.forEach((doc) => {
        console.log("실시간 경매 상태:", doc.data());
      });
    });
    return () => unsub();
  }, []);

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
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>🔥 Hyupcamp 자낳대 경매 🔥</h1>
      <p>{user}님 ({isAdmin ? "관리자" : "팀장"}) 접속 중</p>
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
          <li key={idx}>
            {b.user}: {b.value} 포인트
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionPage;
