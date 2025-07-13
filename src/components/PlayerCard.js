
import React from "react";

const PlayerCard = ({ player }) => {
  if (!player) return null;

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <img
        src={player.image}
        alt={player.name}
        style={{
          width: "300px",
          height: "420px",
          objectFit: "cover",
          border: "4px solid #333",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
        }}
        onError={(e) => e.target.style.display = "none"}
      />
    </div>
  );
};

export default PlayerCard;
