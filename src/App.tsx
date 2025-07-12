import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AuctionPage from "./pages/AuctionPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  return loggedInUser ? (
    <AuctionPage username={loggedInUser} />
  ) : (
    <LoginPage onLogin={(username) => setLoggedInUser(username)} />
  );
}

export default App;