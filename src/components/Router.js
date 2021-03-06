import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from "components/Navigation";
import Auth from "routes/Auth";
import Setting from "routes/Setting";
import Profile from "routes/Profile";
import Home from "routes/Home";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile userObj={userObj} />
            </Route>
            <Route exact path="/setting">
              <Setting userObj={userObj} refreshUser={refreshUser} />
            </Route>
          </>
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
