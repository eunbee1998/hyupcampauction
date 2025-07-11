
import React from "react";

const USERS = [
  { name: "팀장1", isAdmin: false },
  { name: "팀장2", isAdmin: false },
  { name: "팀장3", isAdmin: false },
  { name: "팀장4", isAdmin: false },
  { name: "관리자", isAdmin: true }
];

function LoginPage({ onLogin }) {
  return (
    <div style={{ textAlign: "center", marginTop: "25vh" }}>
      <h2>사용자 선택</h2>
      {USERS.map((user, idx) => (
        <button
          key={idx}
          onClick={() => onLogin(user.name, user.isAdmin)}
          style={{ margin: 10, padding: 10 }}
        >
          {user.name}
        </button>
      ))}
    </div>
  );
}

export default LoginPage;
