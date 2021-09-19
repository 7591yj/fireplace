import { updateProfile } from "@firebase/auth";
import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "css/Setting.css";

const Setting = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [changeMade, setChangeMade] = useState(false);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      setChangeMade(true);
      refreshUser();
    }
  };

  const email = authService.currentUser.email;

  return (
    <>
      <div className="container">
        <div className="emailViewer">
          <span>
            <strong>Your email:</strong>
          </span>
          <span className="email">{email}</span>
          <span className="emailWarn">You cannot change your email.</span>
        </div>
        <span>
          <strong>Your username:</strong>
        </span>
        <form onSubmit={onSubmit} className="displayNameEdit">
          <input
            onChange={onChange}
            type="text"
            placeholder="Display name"
            value={newDisplayName}
            className="formInputSetting"
          />
          <input type="submit" value="Update username" className="formBtn" />
        </form>
        {changeMade && (
          <div className="checkerDiv">
            <FontAwesomeIcon icon={faCheckSquare} className="checker" />
            <span> Changes made.</span>
          </div>
        )}
        <button className="logOut" onClick={onLogOutClick}>
          Log out
        </button>
      </div>
    </>
  );
};

export default Setting;
