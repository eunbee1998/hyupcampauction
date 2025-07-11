
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot as onCollSnapshot,
  serverTimestamp
} from 'firebase/firestore';

const cards = Array.from({ length: 20 }, (_, i) => {
  const num = (i + 1).toString().padStart(2, '0');
  const pos = ['TOP', 'JUG', 'MID', 'ADC', 'SUP'][i % 5];
  return {
    filename: num + "_선수" + (i + 1) + "_" + pos + ".png",
    name: "선수" + (i + 1),
    position: pos
  };
});

function Auction({ username }) {
  const [bid, setBid] = useState('');
  const [highestBid, setHighestBid] = useState({ name: '', amount: 0 });
  const [bidHistory, setBidHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [cardIndex, setCardIndex] = useState(0);

  const currentCard = cards[cardIndex];

  useEffect(() => {
    const unsubCurrent = onSnapshot(doc(db, "auction", "currentBid"), (docSnap) => {
      if (docSnap.exists()) setHighestBid(docSnap.data());
    });

    const unsubTimer = onSnapshot(doc(db, "auction", "timer"), (docSnap) => {
      if (docSnap.exists()) setTimeLeft(docSnap.data().secondsLeft);
    });

    const q = query(collection(db, "auction", "history", "bids"), orderBy("timestamp", "desc"), limit(5));
    const unsubHistory = onCollSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setBidHistory(data);
    });

    return () => {
      unsubCurrent();
      unsubTimer();
      unsubHistory();
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("⏱️ 타이머 종료! 낙찰자: " + highestBid.name + " / " + highestBid.amount + " 포인트");
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [highestBid]);

  const submitBid = async () => {
    const amount = parseInt(bid);
    if (amount > highestBid.amount) {
      await setDoc(doc(db, "auction", "currentBid"), { name: username, amount });
      await addDoc(collection(db, "auction", "history", "bids"), {
        name: username,
        amount,
        timestamp: serverTimestamp()
      });
      await setDoc(doc(db, "auction", "timer"), { secondsLeft: 15 });
    } else {
      alert("현재 입찰가보다 높은 금액을 입력하세요.");
    }
    setBid('');
  };

  const nextCard = () => {
    if (cardIndex < cards.length - 1) {
      setCardIndex(prev => prev + 1);
      setHighestBid({ name: '', amount: 0 });
      setTimeLeft(15);
    } else {
      alert("📦 모든 카드 경매가 완료되었습니다.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2>현재 카드: {currentCard.name} ({currentCard.position})</h2>
      <img
        src={process.env.PUBLIC_URL + "/images/" + currentCard.filename}
        alt={currentCard.name}
        style={{ width: '250px', height: '360px', borderRadius: '10px', marginBottom: '20px' }}
      />
      <h3>현재 최고 입찰가: {highestBid.amount} / 입찰자: {highestBid.name}</h3>
      <h4>⏱️ 남은 시간: {timeLeft}초</h4>
      <input value={bid} onChange={e => setBid(e.target.value)} placeholder="입찰 금액" type="number" />
      <button onClick={submitBid}>입찰</button>
      <button onClick={nextCard} style={{ marginLeft: '20px' }}>다음 카드 ▶</button>
      <h3 style={{ marginTop: '40px' }}>🧾 최근 입찰 내역</h3>
      <ul>
        {bidHistory.map((item, index) => (
          <li key={index}>{item.name}: {item.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Auction;
