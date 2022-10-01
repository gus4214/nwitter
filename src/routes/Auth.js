import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Auth = () => {
  const [newAccount, setNewAccount] = useState(true);

  const [loginUserInfo, setLoginUserInfo] = useState({
    email: "",
    password: "",
  });

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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={getUserInfo}
        />
        <input
          name="password"
          type="password"
          placeholder="Passwrod"
          required
          value={password}
          onChange={getUserInfo}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log in"} />
      </form>
      <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;
