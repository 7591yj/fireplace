import React, { useState, useEffect } from "react";
import { updateProfile } from "@firebase/auth";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.displayName === null) {
          const emailName = user.email.indexOf("@");
          const _displayName = user.email.substring(0, emailName);
          updateProfile(user, { displayName: _displayName });
        }
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          // updateProfile: (args) => updateProfile(user, args),
        });
      } else {
        setUserObj(null);
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    setUserObj({
      displayName: authService.currentUser.displayName,
      uid: authService.currentUser.uid,
      // updateProfile: (args) => updateProfile(authService.currentUser, args),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; FirePlace {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
