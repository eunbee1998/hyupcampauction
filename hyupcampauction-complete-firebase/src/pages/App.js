import React, { useState } from "react";
import LoginPage from "./LoginPage";
import AuctionPage from "./AuctionPage";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (name, admin) => {
    setUser(name);
    setIsAdmin(admin);
  };

  return user ? (
    <AuctionPage user={user} isAdmin={isAdmin} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}

export default App;
