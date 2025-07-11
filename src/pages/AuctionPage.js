import React from "react";

function AuctionPage({ user, isAdmin }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Hyupcamp 자낳대 경매</h1>
      <h2>{user}님 ({isAdmin ? "관리자" : "팀장"}) 환영합니다!</h2>
      <p>여기에 경매 시스템 UI가 구성됩니다.</p>
    </div>
  );
}

export default AuctionPage;
