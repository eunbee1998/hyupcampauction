
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
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
  const [cardIndex, setCardIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const isAdmin = username === "관리자";

  const currentCard = cards[cardIndex];

  useEffect(() => {
    const unsubCurrent = onSnapshot(doc(db, "auction", "currentBid"), (docSnap) => {
      if (docSnap.exists()) setHighestBid(docSnap.data());
    });

    const unsubTimer = onSnapshot(doc(db, "auction", "state"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCardIndex(data.cardIndex || 0);
        setTimeLeft(data.secondsLeft || 0);
        setTimerActive(data.secondsLeft > 0);
      }
    });

    const q = query(collection(db, "auction", "history", "bids"), orderBy("timestamp", "desc"), limit(5));
    const unsubHistory = onSnapshot(q, (snapshot) => {
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
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const updated = prev - 1;
          if (updated <= 0) {
            clearInterval(timer);
            setTimerActive(false);
            alert("⏱️ 타이머 종료! 낙찰자: " + highestBid.name + " / " + highestBid.amount + " 포인트");
          }
          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  const submitBid = async () => {
    const amount = parseInt(bid);
    if (amount > highestBid.amount) {
      await setDoc(doc(db, "auction", "currentBid"), { name: username, amount });
      await addDoc(collection(db, "auction", "history", "bids"), {
        name: username,
        amount,
        timestamp: serverTimestamp()
      });
      await setDoc(doc(db, "auction", "state"), { cardIndex, secondsLeft: 15 });
    } else {
      alert("현재 입찰가보다 높은 금액을 입력하세요.");
    }
    setBid('');
  };

  const startTimer = async () => {
    if (isAdmin) {
      await setDoc(doc(db, "auction", "state"), { cardIndex, secondsLeft: 15 });
    }
  };

  const nextCard = async () => {
    if (!isAdmin) return;
    const next = cardIndex + 1;
    if (next < cards.length) {
      await setDoc(doc(db, "auction", "state"), { cardIndex: next, secondsLeft: 0 });
      await setDoc(doc(db, "auction", "currentBid"), { name: "", amount: 0 });
    } else {
      alert("📦 모든 카드 경매가 완료되었습니다.");
    }
  };

  const resetAuction = async () => {
    if (!window.confirm("정말로 경매를 초기화하시겠습니까?")) return;
    await setDoc(doc(db, "auction", "currentBid"), { name: "", amount: 0 });
    await setDoc(doc(db, "auction", "state"), { cardIndex: 0, secondsLeft: 0 });
    const historyRef = collection(db, "auction", "history", "bids");
    const bids = await getDocs(historyRef);
    for (let bid of bids.docs) {
      await deleteDoc(bid.ref);
    }
    alert("🧼 경매 초기화 완료!");
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
      {isAdmin && (
        <div>
          <button onClick={startTimer}>⏱ 타이머 시작</button>
          <button onClick={nextCard}>다음 카드 ▶</button>
          <button onClick={resetAuction} style={{ backgroundColor: 'red', color: 'white' }}>🧼 경매 초기화</button>
        </div>
      )}
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
