import React from "react";
import styles from "./auth.module.css";
import { useAuth } from "react-use-auth";

const Login = () => {

  const { isAuthenticated, login, logout } = useAuth();

  console.log(isAuthenticated);

  if (isAuthenticated()) {
    return <button onClick={logout}>Logout</button>;
  } else {
    return <button onClick={login}>Login</button>;
  }
};

const PreAuthentication = () => {

  return (
    <div className={styles.container}>
      <Login />
    </div>
  );
};

export default PreAuthentication;
