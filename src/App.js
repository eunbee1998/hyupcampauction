
import React, { useState } from 'react';
import Login from './components/Login';
import Auction from './components/Auction';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <div>
      {loggedInUser ? (
        <Auction teamManager={loggedInUser} />
      ) : (
        <Login onLogin={setLoggedInUser} />
      )}
    </div>
  );
}

export default App;
