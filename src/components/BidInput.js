
import React, { useState } from "react";

const BidInput = ({ onBidSubmit }) => {
  const [bid, setBid] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(bid, 10);
    if (!isNaN(value) && value > 0) {
      onBidSubmit(value);
      setBid("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="입찰 금액 입력"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        style={{ fontSize: "1.2rem", padding: "5px" }}
      />
      <button type="submit" style={{ fontSize: "1.2rem", marginLeft: "10px" }}>
        입찰
      </button>
    </form>
  );
};

export default BidInput;
