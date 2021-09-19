import React, { useState } from "react";
import { authService } from "fbase";
import {
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "@firebase/auth";
import AuthForm from "components/AuthForm";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "css/Auth.css";

const Auth = () => {
  const [error, setError] = useState("");

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;

    let provider;

    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
        const result = await signInWithPopup(authService, provider);
        GoogleAuthProvider.credentialFromResult(result);
        // credential.acccessToken;
      } else if (name === "github") {
        provider = new GithubAuthProvider();
        const result = await signInWithPopup(authService, provider);
        GithubAuthProvider.credentialFromResult(result);
        // credential.accessToken;
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="authContainer">
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google" className="google">
          <FontAwesomeIcon icon={faGoogle} />
          <span className="oauth">Continue with Google</span>
        </button>
        <button onClick={onSocialClick} name="github" className="github">
          <FontAwesomeIcon icon={faGithub} />
          <span className="oauth">Continue with Github</span>
        </button>
        {error && <span className="error">{error}</span>}
      </div>
    </div>
  );
};
export default Auth;
