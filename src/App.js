
import React, { useState } from 'react';
import Auction from './components/Auction';

function App() {
  const [teamManagers, setTeamManagers] = useState(["", "", "", ""]);
  const [budgets, setBudgets] = useState([5000, 5000, 5000, 5000]);
  const [submitted, setSubmitted] = useState(false);

  const handleNameChange = (index, value) => {
    const updated = [...teamManagers];
    updated[index] = value;
    setTeamManagers(updated);
  };

  const handleBudgetChange = (index, value) => {
    const updated = [...budgets];
    updated[index] = parseInt(value || 0);
    setBudgets(updated);
  };

  const handleSubmit = () => {
    if (teamManagers.some(name => name.trim() === "")) {
      alert("모든 팀장 이름을 입력해주세요.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {!submitted ? (
        <>
          <h1>팀장 이름 및 포인트 설정</h1>
          {teamManagers.map((name, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder={`팀장 ${i + 1} 이름`}
                value={name}
                onChange={(e) => handleNameChange(i, e.target.value)}
                style={{ padding: '8px', marginRight: '10px' }}
              />
              <input
                type="number"
                placeholder="포인트"
                value={budgets[i]}
                onChange={(e) => handleBudgetChange(i, e.target.value)}
                style={{ padding: '8px' }}
              />
            </div>
          ))}
          <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px' }}>
            경매 시작
          </button>
        </>
      ) : (
        <Auction teamManagers={teamManagers} budgets={budgets} />
      )}
    </div>
  );
}

export default App;
