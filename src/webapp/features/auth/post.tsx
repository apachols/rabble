import React from "react";
import styles from "./auth.module.css";

import { useAuth } from "react-use-auth";

const PostAuthentication = () => {
  const { user, userId } = useAuth();

  return (
    <div className={styles.container}>
      <h3>Auth redirect complete</h3>
      <h4><pre>{JSON.stringify(userId, null, 2)}</pre></h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default PostAuthentication;
