import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { authService } from "fbase";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "css/Auth.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  return (
    <>
      <div className="authFormContainer">
        <FontAwesomeIcon icon={faFire} size="3x" style={{ margin: "10px" }} />
        <span style={{ fontWeight: 600, fontSize: "36px" }}>FirePlace</span>
        <span
          style={{
            fontWeight: 400,
            fontSize: "12px",
            textAlign: "center",
            margin: "10px",
          }}
        >
          Welcome to FirePlace! Please{" "}
          {newAccount ? "create an account" : "sign in"} to continue.
        </span>
        <form onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
            className="formInput"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
            className="formInput"
          />
          <input
            type="submit"
            value={newAccount ? "Create account" : "Sign in"}
            className="formBtn"
          />
          {error && <span className="error">{error}</span>}
        </form>
        <span onClick={toggleAccount} className="changer">
          {newAccount ? "or sign in" : "or create account"}
        </span>
        <span
          style={{
            fontWeight: 400,
            fontSize: "12px",
            textAlign: "center",
            margin: "10px",
            color: "tomato",
          }}
        >
          At this point, there is an error with OAuth login (Google/Github).{" "}
          <br /> Logging in via OAuth works sometimes, but in many cases does
          not. <br />
          Until it gets fixed, I highly recommand using email & password.
        </span>
      </div>
    </>
  );
};

export default AuthForm;
