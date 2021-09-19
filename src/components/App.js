import React, { useState, useEffect } from "react";
import { updateProfile } from "@firebase/auth";
import AppRouter from "components/Router";
import { authService } from "fbase";
import "css/App.css";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    });
  };

  return (
    <>
      <div className="appContainer">
        {init ? (
          <AppRouter
            refreshUser={refreshUser}
            isLoggedIn={isLoggedIn}
            userObj={userObj}
          />
        ) : (
          <div className="init-div">
            <FontAwesomeIcon
              className="init-icon"
              icon={faFire}
              color={"#2f3640"}
              size="2x"
            />
            <span className="init-text">Initializing...</span>
          </div>
        )}
        <footer>
          FirePlace {new Date().getFullYear()} &#183; icons delivered by{" "}
          <a className="footerA" href="https://fontawesome.com/">
            Font Awesome
          </a>
          , favicon uses "fire" icon from the same origin but with a circle
          background
        </footer>
      </div>
    </>
  );
}

export default App;
