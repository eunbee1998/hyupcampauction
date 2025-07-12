import React, { useState } from "react";
import LoginPage from "./LoginPage";
import AuctionPage from "./AuctionPage";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return user ? (
    <AuctionPage user={user} isAdmin={isAdmin} />
  ) : (
    <LoginPage onLogin={(name, admin) => {
      setUser(name);
      setIsAdmin(admin);
    }} />
  );
}

export default App;
