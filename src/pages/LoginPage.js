import React, { useState } from "react";

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onLogin(name.trim());
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>팀장 로그인</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="팀장 이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">입장</button>
      </form>
    </div>
  );
}

export default LoginPage;
