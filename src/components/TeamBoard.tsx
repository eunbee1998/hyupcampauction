import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const teamNames = ["팀장1", "팀장2", "팀장3", "팀장4"];

const TeamBoard = () => {
  const [teamData, setTeamData] = useState<any>({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "auction", "results", "entries"), (snapshot) => {
      const teams: any = {
        팀장1: [],
        팀장2: [],
        팀장3: [],
        팀장4: [],
      };
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (teams[data.winner]) {
          teams[data.winner].push(data.player);
        }
      });
      setTeamData(teams);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center" }}>🧾 팀 현황판</h2>
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        {teamNames.map((name) => (
          <div key={name} style={{ width: "22%", background: "#fff", padding: "1rem", margin: "1rem", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h3>{name}</h3>
            {teamData[name]?.length > 0 ? (
              <ul>
                {teamData[name].map((player: any, idx: number) => (
                  <li key={idx}>{player.name}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontStyle: "italic", color: "#888" }}>아직 없음</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamBoard;