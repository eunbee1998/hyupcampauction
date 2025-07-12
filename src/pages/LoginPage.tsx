import React, { useState } from "react";

const LoginPage = ({ onLogin }: { onLogin: (username: string) => void }) => {
  const [selectedUser, setSelectedUser] = useState("팀장1");

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>LOL 팀 경매 로그인</h1>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option>팀장1</option>
        <option>팀장2</option>
        <option>팀장3</option>
        <option>팀장4</option>
        <option>관리자</option>
      </select>
      <br />
      <button style={{ marginTop: "1rem" }} onClick={() => onLogin(selectedUser)}>
        로그인
      </button>
    </div>
  );
};

export default LoginPage;