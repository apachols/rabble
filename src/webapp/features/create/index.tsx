import React, { useState } from "react";
import styles from "./create.module.css";
import axios from "axios";
import { createUserGame } from "../../app/localStorage";
import Loader from "react-loader-spinner";

const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;

const postToCreateGame = async () => {
  console.log('posting to create game:', API_ROOT);
  const res = await axios({
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    url: `${API_ROOT}/games/rabble/create`,
    data: {
      setupData: {},
      numPlayers: 2,
    },
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
  const [loading, setLoading] = useState(false);
  return (
    <div className={styles.form}>
      <h3>Create a new game</h3>
      {loading ? (
        <Loader type="Grid" color="#00BFFF" height={100} width={100} />
      ) : (
        <button
          onClick={() => {
            setLoading(true);
            postToCreateGame();
          }}
        >
          create
        </button>
      )}
    </div>
  );
};

export default CreateGame;
