import React, { useState } from "react";
import axios from "axios";
import styles from "./join.module.css";
import { useParams } from "react-router-dom";
import { updateUserNickName, joinUserGame } from "../../app/localStorage";

const server = `${window.location.hostname}:8000`;

const postToJoinGame = async (gameID: string, nickname: string) => {
  // TODO we need to query the server to find out the correct ordinal playerID
  const playerID = "1";
  const res = await axios({
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    url: `http://${server}/games/rabble/${gameID}/join`,
    data: {
      playerID,
      playerName: nickname
    }
  });

  const { playerCredentials } = res.data;

  updateUserNickName(nickname);
  joinUserGame(gameID, playerID, playerCredentials);

  // TODO, react router recommends doing this with <Redirect> instead
  window.location.href = `/game/${gameID}`;
};

const JoinGame = () => {
  const { gameID } = useParams();
  const [nickname, setNickname] = useState("");

  if (!gameID) {
    return <div>Try /join/gameID</div>;
  }

  return (
    <div className={styles.form}>
      <h3>Join game {gameID}</h3>
      <input
        name="nickname"
        value={nickname}
        onChange={ev => setNickname(ev.target.value)}
      />
      <button onClick={() => postToJoinGame(gameID, nickname)}>create</button>
    </div>
  );
};

export default JoinGame;
