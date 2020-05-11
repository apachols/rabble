import React, { useState } from "react";
import axios from "axios";
import styles from "./join.module.css";
import { useParams } from "react-router-dom";
import {
  getUserInfo,
  getPlayerGame,
  updateUserNickName,
  joinUserGame,
} from "../../app/localStorage";

const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;

type serverPlayerMetadata = {
  id: number; // WHY
  name: string;
};

const redirectToGameView = (gameID: string) => {
  // TODO, react router recommends doing this with <Redirect> instead
  window.location.href = `/game/${gameID}`;
};

const getGameInfo = async (gameID: string) => {
  const getResult = await axios({
    method: "get",
    headers: {
      "content-type": "application/json",
    },
    url: `${API_ROOT}/games/rabble/${gameID}`,
  });

  return getResult.data;
};

const getNextOpenSeat = (gameInfo: any): string => {
  const players: serverPlayerMetadata[] = gameInfo.players;
  const openSeatsOrderedById = players.filter((p) => !p.name).sort((p) => p.id);
  const nextOpenSeat = openSeatsOrderedById[0];
  if (!nextOpenSeat) {
    throw new Error("Game is already full");
  }
  return String(nextOpenSeat.id);
};

const postToJoinGame = async (gameID: string, nickname: string) => {
  const gameInfo = await getGameInfo(gameID);
  const playerID = getNextOpenSeat(gameInfo);

  const postResult = await axios({
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    url: `${API_ROOT}/games/rabble/${gameID}/join`,
    data: {
      playerID,
      playerName: nickname,
    },
  });

  const { playerCredentials } = postResult.data;

  console.log(playerCredentials);

  updateUserNickName(nickname);

  joinUserGame(gameID, playerID, playerCredentials);

  redirectToGameView(gameID);
};

const JoinGame = () => {
  const { gameID } = useParams();
  const [nickname, setNickname] = useState(getUserInfo().nickname);

  if (!gameID) {
    return <div>Game ID Missing</div>;
  }

  const gameInfo = getPlayerGame(gameID);
  if (gameInfo?.playerID && gameInfo?.playerCredentials) {
    redirectToGameView(gameID);
  }

  return (
    <div className={styles.form}>
      <h3>Join game {gameID}</h3>
      <input
        name="nickname"
        value={nickname}
        onChange={(ev) => setNickname(ev.target.value)}
      />
      <button onClick={() => postToJoinGame(gameID, nickname)}>join</button>
    </div>
  );
};

export default JoinGame;
