import React, { useState } from "react";
import AuctionPage from "./pages/AuctionPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <AuctionPage user={user} />
  ) : (
    <LoginPage onLogin={(name) => setUser(name)} />
  );
}

export default App;
