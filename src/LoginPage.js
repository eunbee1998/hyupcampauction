
import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    const trimmed = username.trim();
    if (trimmed && ["팀장1", "팀장2", "팀장3", "팀장4", "관리자"].includes(trimmed)) {
      onLogin(trimmed);
    } else {
      alert("팀장1~4 또는 관리자 중 하나를 입력하세요.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>경매 프로그램 로그인</h1>
      <input
        type="text"
        placeholder="팀장1 ~ 팀장4 또는 관리자"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ fontSize: "1.2rem", padding: "10px" }}
      />
      <button
        onClick={handleLogin}
        style={{ fontSize: "1.2rem", padding: "10px 20px", marginLeft: "10px" }}
      >
        로그인
      </button>
    </div>
  );
};

export default LoginPage;
