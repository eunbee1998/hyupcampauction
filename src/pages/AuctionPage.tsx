import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import PlayerCard from "../components/PlayerCard";
import TeamBoard from "../components/TeamBoard";

import { players } from "../components/players";

const AuctionPage = ({ username }: { username: string }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [topBidder, setTopBidder] = useState<string | null>(null);
  const [recentBids, setRecentBids] = useState<any[]>([]);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPlayer = players[playerIndex];
  const disableBid = username === topBidder || auctionEnded;
  const isAdmin = username === "관리자";

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
        playerId: currentPlayer.id,
        timestamp: serverTimestamp()
      });
    }
  };

  const clearBidEntries = async () => {
    const bidsRef = collection(db, "auction", "bids", "entries");
    const snapshot = await getDocs(bidsRef);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(bidsRef, docSnap.id)));
    await Promise.all(deletePromises);
  };

  const goToNextPlayer = async () => {
    if (!isAdmin) return;
    if (playerIndex < players.length - 1) {
      setPlayerIndex((prev) => prev + 1);
      setHighestBid(null);
      setTopBidder(null);
      setBidAmount(0);
      setRecentBids([]);
      setAuctionEnded(false);
      await clearBidEntries(); // 입찰 초기화 추가
      startTimer();
    } else {
      alert("모든 선수 경매가 완료되었습니다.");
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && !auctionEnded && topBidder && highestBid !== null) {
      setAuctionEnded(true);
      addDoc(collection(db, "auction", "results", "entries"), {
        winner: topBidder,
        amount: highestBid,
        player: currentPlayer,
        timestamp: serverTimestamp()
      });
    }
  }, [timeLeft, auctionEnded, topBidder, highestBid]);

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
          startTimer();
        }
      }
    });

    startTimer();

      </div>

      {/* 중앙 메인 경매 영역 */}
      <div style={{ width: "60%", padding: "2rem", textAlign: "center" }}>
  }, [highestBid]);

      </div>

      {/* 중앙 메인 경매 영역 */}
      <div style={{ width: "60%", padding: "2rem", textAlign: "center" }}>

    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{username} 경매 페이지</h1>
      <PlayerCard player={currentPlayer} />
      <h2>남은 시간: {timeLeft}초</h2>
      <h2>현재 최고 입찰가: {highestBid ?? "없음"} ({topBidder ?? "없음"})</h2>
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

      {isAdmin && (
        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={goToNextPlayer}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#333", color: "#fff", fontWeight: "bold" }}
          >
            👉 다음 선수로 진행
          </button>
        </div>
      )}

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
