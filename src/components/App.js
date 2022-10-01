import React, { useState } from "react";
import Routers from "components/Router";
import { auth } from "fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);


  return (
    <>
      <Routers isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
