import React, { useState } from "react";

const ADMIN_CODE = "admin123";

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAdmin = password === ADMIN_CODE;
    onLogin(name, isAdmin);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "25vh" }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름 입력" required />
        <br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" />
        <br />
        <button type="submit">입장</button>
      </form>
    </div>
  );
}

export default LoginPage;
