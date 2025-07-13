
import React from "react";

const PlayerCard = ({ player }) => {
  if (!player) return null;

  return (
    <div style={{
      border: "2px solid #ccc",
      borderRadius: "10px",
      padding: "20px",
      margin: "20px 0",
      textAlign: "center",
      backgroundColor: "#f4f4f4"
    }}>
      <h2>{player.name}</h2>
      <p>포지션: {player.position}</p>
      <img
        src={player.image}
        alt={player.name}
        style={{ width: "200px", height: "200px", objectFit: "cover", marginTop: "10px" }}
        onError={(e) => e.target.style.display = "none"}
      />
    </div>
  );
};

export default PlayerCard;
