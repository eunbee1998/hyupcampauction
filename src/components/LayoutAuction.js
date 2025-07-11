
import React, { useState, useEffect } from 'react';
import './LayoutAuction.css';
import { db } from '../firebase';
import {
  doc, setDoc, getDoc,
  onSnapshot, collection, addDoc,
  serverTimestamp, query, orderBy, limit
} from 'firebase/firestore';

function LayoutAuction() {
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState({ name: '', amount: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastTick, setLastTick] = useState(Date.now());
  const [bidHistory, setBidHistory] = useState([]);

  const username = "팀장1"; // 추후 로그인 값으로 교체 가능

  useEffect(() => {
    const unsubBid = onSnapshot(doc(db, "auction", "currentBid"), (snap) => {
      if (snap.exists()) setHighestBid(snap.data());
    });

    const unsubTimer = onSnapshot(doc(db, "auction", "state"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTimeLeft(data.secondsLeft || 0);
        setLastTick(data.updatedAt || Date.now());
      }
    });

    const bidQuery = query(collection(db, "auction", "history", "bids"), orderBy("timestamp", "desc"), limit(5));
    const unsubHistory = onSnapshot(bidQuery, (snapshot) => {
      setBidHistory(snapshot.docs.map(doc => doc.data()));
    });

    return () => {
      unsubBid(); unsubTimer(); unsubHistory();
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastTick) / 1000);
      const remaining = Math.max(15 - elapsed, 0);
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastTick]);

  const handleBidChange = (delta) => {
    setBidAmount(prev => Math.max(prev + delta, 0));
  };

  const submitBid = async () => {
    if (bidAmount > highestBid.amount) {
      await setDoc(doc(db, "auction", "currentBid"), { name: username, amount: bidAmount });
      await addDoc(collection(db, "auction", "history", "bids"), {
        name: username,
        amount: bidAmount,
        timestamp: serverTimestamp()
      });
      await setDoc(doc(db, "auction", "state"), {
        secondsLeft: 15,
        updatedAt: Date.now()
      });
      alert("✅ 입찰 완료!");
    } else {
      alert("❌ 현재 최고 입찰가보다 높아야 합니다.");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="team-box"><div className="team-title">🔵 팀장1</div>포인트: 1000</div>
        <div className="team-box"><div className="team-title">🔴 팀장2</div>포인트: 1000</div>
        <div className="team-box"><div className="team-title">🟢 팀장3</div>포인트: 1000</div>
        <div className="team-box"><div className="team-title">🟡 팀장4</div>포인트: 1000</div>
      </div>
      <div className="main">
        <h1>Hyupcamp 자낳대 경매</h1>
        <div className="timer">TIME COUNT: {timeLeft}</div>
        <div className="center-panel">
          <div>입찰 금액</div>
          <input type="number" value={bidAmount} readOnly />
          <div className="bid-buttons">
            <button onClick={() => handleBidChange(5)}>+5</button>
            <button onClick={() => handleBidChange(10)}>+10</button>
            <button onClick={() => handleBidChange(50)}>+50</button>
            <button onClick={() => handleBidChange(100)}>+100</button>
            <button className="submit" onClick={submitBid}>제출</button>
          </div>
          <h3 style={{ marginTop: '30px' }}>🧾 최근 입찰</h3>
          <ul>
            {bidHistory.map((b, i) => (
              <li key={i}>{b.name}: {b.amount}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rightbar">
        <h3>포지션별 선수</h3>
        <div className="player-grid">
          <div className="player-icon">TOP1</div><div className="player-icon">JUG1</div>
          <div className="player-icon">MID1</div><div className="player-icon">ADC1</div><div className="player-icon">SUP1</div>
        </div>
        <div className="player-grid">
          <div className="player-icon">TOP2</div><div className="player-icon">JUG2</div>
          <div className="player-icon">MID2</div><div className="player-icon">ADC2</div><div className="player-icon">SUP2</div>
        </div>
        <h3 style={{ marginTop: '20px' }}>📢 채팅 로그</h3>
        <div className="chat-box">
          {bidHistory.map((b, i) => (
            <div key={i}>🔔 {b.name}님이 {b.amount} 입찰</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LayoutAuction;
