import React, { useState } from "react";
import styles from "./create.module.css";
import axios from "axios";
import { createUserGame } from "../../app/localStorage";
import Loader from "react-loader-spinner";

import { withRouter } from "react-router-dom";
import { History } from "history";

const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;

interface CreateGameProps {
  history: History;
}

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

  return matchID;
};

const CreateGame = ({ history }: CreateGameProps) => {
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
            const idtoPush = postToCreateGame();
            history.push(`/join/${idtoPush}`);
          }}
        >
          create
        </button>
      )}
    </div>
  );
};

export default withRouter(CreateGame);
