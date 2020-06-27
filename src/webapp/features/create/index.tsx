import React, { useState } from "react";
import styles from "./create.module.css"
import { postToCreateGame } from "./create.actions";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";

const CreateGame = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  return (
    <div className={styles.form}>
      <h3>Create a new game</h3>
      {loading ? (
        <Loader type="Grid" color="#00BFFF" height={100} width={100} />
      ) : (
        <button
          onClick={() => {
            setLoading(true);
            postToCreateGame(history);
          }}
        >
          create
        </button>
      )}
    </div>
  );
};

export default CreateGame;
