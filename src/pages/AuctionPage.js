import React, { useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function AuctionPage({ user, isAdmin }) {
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "auction/status"), (snapshot) => {
      snapshot.forEach((doc) => {
        console.log("실시간 데이터:", doc.id, doc.data());
      });
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Hyupcamp 자낳대 경매</h1>
      <h2>{user}님 ({isAdmin ? "관리자" : "팀장"}) 환영합니다!</h2>
      <p>여기에 실시간 동기화된 경매 UI가 표시됩니다.</p>
    </div>
  );
}

export default AuctionPage;
