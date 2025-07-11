
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

function Auction({ username }) {
  const [bid, setBid] = useState('');
  const [highestBid, setHighestBid] = useState({ name: '', amount: 0 });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "auction", "currentBid"), (docSnap) => {
      if (docSnap.exists()) setHighestBid(docSnap.data());
    });
    return () => unsub();
  }, []);

  const submitBid = async () => {
    const amount = parseInt(bid);
    if (amount > highestBid.amount) {
      await setDoc(doc(db, "auction", "currentBid"), { name: username, amount });
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
    </div>
  );
}

export default Auction;
