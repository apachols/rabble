import React from "react";
import styles from "./auth.module.css";
import { useAuth } from "react-use-auth";

const PreAuthentication = () => {
  const { login } = useAuth();

  return (
    <div className={styles.container}>
      <h1>Sign In to Rabble</h1>
      <button
        onClick={() => {
          login();
        }}
      >
        <span>Sign In</span>
      </button>

      <div className={styles.loginTilesContainer}>
        <div className={styles.loginTile}>O</div>
        <div className={styles.loginTile}>R</div>
      </div>
      <hr></hr>

      <button>
        <span>Sign Up</span>
      </button>
      <p>Rabble utilizes Auth0</p>
    </div>
  );
};

export default PreAuthentication;
