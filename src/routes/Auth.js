import React from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "fbase";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import "routes/Auth.scss";

const Auth = () => {
  const onSocialClick = async (e) => {
    const { name } = e.target;
    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#28b5f4"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="authBtns">
        <button className="authBtn" name="google" onClick={onSocialClick}>
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button className="authBtn" name="github" onClick={onSocialClick}>
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
