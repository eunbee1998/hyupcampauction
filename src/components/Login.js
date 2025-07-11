
import React, { useState } from 'react';

const predefinedUsers = [
  { name: '팀장1', password: 'pass1' },
  { name: '팀장2', password: 'pass2' },
  { name: '팀장3', password: 'pass3' },
  { name: '팀장4', password: 'pass4' },
];

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = predefinedUsers.find(u => u.name === name && u.password === password);
    if (user) {
      onLogin(user.name);
    } else {
      alert('이름 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>팀장 로그인</h2>
      <input
        type="text"
        placeholder="팀장 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: '10px', padding: '8px' }}
      />
      <br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: '10px', padding: '8px' }}
      />
      <br />
      <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
        로그인
      </button>
    </div>
  );
}

export default Login;
