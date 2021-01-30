import React, { useEffect } from "react";
import styles from "./auth.module.css";
import { useAuth } from "react-use-auth";

const AuthCallback = () => {
  const { handleAuthentication } = useAuth();

  const todoPostLoginRoute = '/post-authentication';
  useEffect(() => {
    handleAuthentication({
      postLoginRoute: todoPostLoginRoute
    });
  }, [handleAuthentication]);

  return (
    <div className={styles.container}>
      <h3>Redirecting you...</h3>
    </div>
  );
};

export default AuthCallback;
