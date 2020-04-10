import React from "react";
import styles from "./create.module.css";

const postToCreateGame = () => {
  console.log("creating a game");
};

const CreateGame = () => {
  return (
    <div className={styles.form}>
      <h3>Create a new game</h3>
      <button onClick={() => postToCreateGame()}>create</button>
    </div>
  );
};

export default CreateGame;
