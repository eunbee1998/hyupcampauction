
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
  serverTimestamp,
  getDoc
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
  const [lastUpdated, setLastUpdated] = useState(Date.now());
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
        setLastUpdated(data.updatedAt || Date.now());
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
    if (timeLeft <= 0) return;
    const interval = setInterval(async () => {
      const elapsed = Math.floor((Date.now() - lastUpdated) / 1000);
      const newTime = Math.max(15 - elapsed, 0);
      setTimeLeft(newTime);
      if (newTime === 0) {
        clearInterval(interval);
        alert("⏱️ 타이머 종료! 낙찰자: " + highestBid.name + " / " + highestBid.amount + " 포인트");

        // ✅ 자동 팀 배정 Firestore 저장
        const assignmentRef = collection(db, "auction", "teams", "assignments");
        const player = currentCard.name;
        const position = currentCard.position;
        const team = highestBid.name;
        if (team) {
          await addDoc(assignmentRef, {
            team,
            position,
            player,
            assignedAt: serverTimestamp()
          });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const submitBid = async () => {
    const amount = parseInt(bid);
    if (amount > highestBid.amount) {
      await setDoc(doc(db, "auction", "currentBid"), { name: username, amount });
      await addDoc(collection(db, "auction", "history", "bids"), {
        name: username,
        amount,
        timestamp: serverTimestamp()
      });

      const stateRef = doc(db, "auction", "state");
      const stateSnap = await getDoc(stateRef);
      const currentState = stateSnap.exists() ? stateSnap.data() : {};
      await setDoc(stateRef, {
        ...currentState,
        secondsLeft: 15,
        updatedAt: Date.now(),
        cardIndex: currentState.cardIndex ?? 0
      });
    } else {
      alert("현재 입찰가보다 높은 금액을 입력하세요.");
    }
    setBid('');
  };

  const startTimer = async () => {
    if (isAdmin) {
      await setDoc(doc(db, "auction", "state"), {
        cardIndex,
        secondsLeft: 15,
        updatedAt: Date.now()
      });
    }
  };

  const nextCard = async () => {
    if (!isAdmin) return;
    const next = cardIndex + 1;
    if (next < cards.length) {
      await setDoc(doc(db, "auction", "state"), {
        cardIndex: next,
        secondsLeft: 0,
        updatedAt: Date.now()
      });
      await setDoc(doc(db, "auction", "currentBid"), { name: "", amount: 0 });
    } else {
      alert("📦 모든 카드 경매가 완료되었습니다.");
    }
  };

  const resetAuction = async () => {
    if (!window.confirm("정말로 경매를 초기화하시겠습니까?")) return;
    await setDoc(doc(db, "auction", "currentBid"), { name: "", amount: 0 });
    await setDoc(doc(db, "auction", "state"), {
      cardIndex: 0,
      secondsLeft: 0,
      updatedAt: Date.now()
    });
    const historyRef = collection(db, "auction", "history", "bids");
    const bids = await getDocs(historyRef);
    for (let bid of bids.docs) {
      await deleteDoc(bid.ref);
    }
    alert("🧼 경매 초기화 완료!");
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', fontWeight: 'bold' }}>
        🙋‍♂️ 현재 사용자: {username}
      </div>
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
