
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const TeamStatus = () => {
  const [teamData, setTeamData] = useState({});
  const positions = ['TOP', 'JUG', 'MID', 'ADC', 'SUP'];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "auction", "teams", "assignments"), (snapshot) => {
      const data = {};
      snapshot.forEach(doc => {
        const { team, position, player } = doc.data();
        if (!data[team]) data[team] = {};
        data[team][position] = player;
      });
      setTeamData(data);
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ marginTop: '40px', textAlign: 'center' }}>
      <h3>📋 팀 구성 현황</h3>
      <table border="1" cellPadding="10" style={{ margin: 'auto' }}>
        <thead>
          <tr>
            <th>팀</th>
            {positions.map(pos => <th key={pos}>{pos}</th>)}
          </tr>
        </thead>
        <tbody>
          {Object.keys(teamData).map(team => (
            <tr key={team}>
              <td>{team}</td>
              {positions.map(pos => (
                <td key={pos}>{teamData[team][pos] || '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamStatus;
