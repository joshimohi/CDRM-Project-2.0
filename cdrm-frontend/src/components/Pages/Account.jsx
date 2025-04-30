import React, { useEffect, useState } from "react";
import Register from "./Register";
import MyAccount from "./MyAccount"; // <-- Import the MyAccount component

function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading state

  useEffect(() => {
    fetch('/login/status', {
      method: 'POST',
      credentials: 'include', // Sends cookies with request
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'True') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    })
    .catch(err => {
      console.error("Error checking login status:", err);
      setIsLoggedIn(false); // Assume not logged in on error
    });
  }, []);

  if (isLoggedIn === null) {
    return <div>Loading...</div>; // Optional loading UI
  }

  return (
    <div id="accountpage" className="w-full h-full flex">
      {isLoggedIn ? <MyAccount /> : <Register />}
    </div>
  );
}

export default Account;
