import React from "react";

function AuctionPage({ user }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h2>{user}님 환영합니다!</h2>
      <p>여기는 경매 페이지입니다.</p>
    </div>
  );
}

export default AuctionPage;
