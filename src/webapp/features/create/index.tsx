import React from "react";
import styles from "./create.module.css";
import axios from "axios";
import { createUserGame } from "../../app/localStorage";

const server = `${window.location.hostname}:8000`;

const postToCreateGame = async () => {
  const res = await axios({
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    url: `http://${server}/games/rabble/create`,
    data: {
      setupData: {},
      numPlayers: 2
    }
  });

  const { gameID } = res.data;

  if (gameID) {
    createUserGame(gameID);
  } else {
    throw new Error("Game ID not returned from server");
  }

  // TODO, react router recommends doing this with <Redirect> instead
  window.location.href = `/join/${gameID}`;
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
