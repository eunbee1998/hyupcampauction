
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

function Auction({ username }) {
  const [bid, setBid] = useState('');
  const [highestBid, setHighestBid] = useState({ name: '', amount: 0 });
  const [bidHistory, setBidHistory] = useState([]);

  useEffect(() => {
    const unsubCurrent = onSnapshot(doc(db, "auction", "currentBid"), (docSnap) => {
      if (docSnap.exists()) setHighestBid(docSnap.data());
    });

    const q = query(collection(db, "auction", "history", "bids"), orderBy("timestamp", "desc"), limit(5));
    const unsubHistory = onCollSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setBidHistory(data);
    });

    return () => {
      unsubCurrent();
      unsubHistory();
    };
  }, []);

  const submitBid = async () => {
    const amount = parseInt(bid);
    if (amount > highestBid.amount) {
      await setDoc(doc(db, "auction", "currentBid"), { name: username, amount });
      await addDoc(collection(db, "auction", "history", "bids"), {
        name: username,
        amount,
        timestamp: serverTimestamp()
      });
    } else {
      alert("현재 입찰가보다 높은 금액을 입력하세요.");
    }
    setBid('');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>현재 최고 입찰자: {highestBid.name} / 금액: {highestBid.amount}</h2>
      <input value={bid} onChange={e => setBid(e.target.value)} placeholder="입찰 금액" type="number" />
      <button onClick={submitBid}>입찰</button>
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
