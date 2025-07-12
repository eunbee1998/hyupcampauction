import React from "react";

const PlayerCard = ({ player }: { player: any }) => {
  return (
    <div style={{
      border: "2px solid #ccc",
      borderRadius: "10px",
      padding: "1rem",
      width: "250px",
      margin: "1rem auto"
    }}>
      <img src={player.image} alt={player.name} style={{ width: "100%", borderRadius: "8px" }} />
      <h2>{player.name}</h2>
      <p>{player.position}</p>
    </div>
  );
};

export default PlayerCard;