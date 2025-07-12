import React from "react";

const LoginPage = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>LOL 팀 경매 로그인</h1>
      <select>
        <option>팀장1</option>
        <option>팀장2</option>
        <option>팀장3</option>
        <option>팀장4</option>
        <option>관리자</option>
      </select>
      <br />
      <button style={{ marginTop: "1rem" }}>로그인</button>
    </div>
  );
};

export default LoginPage;