
import React, { useState } from 'react';

const USERS = [
  { name: '팀장1', password: 'pass1' },
  { name: '팀장2', password: 'pass2' },
  { name: '팀장3', password: 'pass3' },
  { name: '팀장4', password: 'pass4' }
];

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const match = USERS.find(u => u.name === name && u.password === password);
    if (match) onLogin(name);
    else alert('로그인 실패: 이름 또는 비밀번호가 올바르지 않습니다.');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>팀장 로그인</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="이름" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={handleLogin}>입장</button>
    </div>
  );
}

export default Login;
