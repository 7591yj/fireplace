import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        {userObj && (
          <Link to="/profile">
            {userObj.displayName
              ? `${userObj.displayName}'s profile`
              : "Profile"}
          </Link>
        )}
      </li>
    </ul>
  </nav>
);
export default Navigation;
