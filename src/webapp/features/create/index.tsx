import React, { useState } from "react";
import styles from "./create.module.css";
import axios from "axios";
import { createUserGame } from "../../app/localStorage";
import Loader from "react-loader-spinner";

import { withRouter, Redirect } from "react-router-dom";

const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;

const CreateGame = () => {
  const [loading, setLoading] = useState(false);

  const [gameID, setGameID] = useState("");

  const postToCreateGame = async () => {
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

    const { matchID } = res.data;

    if (matchID) {
      createUserGame(matchID);
    } else {
      throw new Error("Game ID not returned from server");
    }
    setGameID(matchID);
  };

  return (
    <div className={styles.form}>
      <h3>Create a new game</h3>
      {!!gameID && <Redirect to={`/join/${gameID}`} />}
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

export default withRouter(CreateGame);
