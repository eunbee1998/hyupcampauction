
import React, { useState } from 'react';
import Login from './components/Login';
import Auction from './components/Auction';

function App() {
  const [user, setUser] = useState(null);
  return user ? <Auction username={user} /> : <Login onLogin={setUser} />;
}

export default App;
