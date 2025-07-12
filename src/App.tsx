import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AuctionPage from "./pages/AuctionPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? <AuctionPage /> : <LoginPage onLogin={() => setLoggedIn(true)} />;
}

export default App;