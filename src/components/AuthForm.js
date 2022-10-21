import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "components/AuthForm.scss";

const AuthForm = () => {
  const [newAccount, setNewAccount] = useState(true);
  const [loginUserInfo, setLoginUserInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { email, password } = loginUserInfo;

  const getUserInfo = (event) => {
    const { name, value } = event.target;
    setLoginUserInfo({ ...loginUserInfo, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      const auth = getAuth();
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className="authFormContainer">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={getUserInfo}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Passwrod"
          required
          value={password}
          onChange={getUserInfo}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log in"}
          className="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Log in" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
