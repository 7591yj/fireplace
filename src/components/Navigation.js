import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faUser, faCog } from "@fortawesome/free-solid-svg-icons";
import "css/Navigation.css";

const Navigation = ({ userObj }) => (
  <header>
    <ul>
      <li className="home">
        <Link
          to="/"
          style={{
            marginRight: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 12,
          }}
        >
          <FontAwesomeIcon
            icon={faFire}
            color={"#2f3640"}
            size="2x"
            id="home-item"
          />
        </Link>
      </li>
      <li className="profile">
        {userObj && (
          <Link
            to="/profile"
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faUser} color={"#2f3640"} size="2x" />
          </Link>
        )}
      </li>
      <div className="nav-div">
        <li>
          {userObj && (
            <Link
              to="/setting"
              style={{
                marginLeft: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: 12,
              }}
            >
              <FontAwesomeIcon icon={faCog} color={"#2f3640"} size="2x" />
            </Link>
          )}
        </li>
      </div>
    </ul>
  </header>
);

export default Navigation;
