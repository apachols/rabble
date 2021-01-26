import React, { useState, useEffect } from "react";
import Button from "../rabble/components/Button/Button";
import axios from "axios";
import styles from "./join.module.css";
import tileBagImg from "../../assets/images/tilebag.png";
import { useParams, Redirect } from "react-router-dom";

import {
  getUserInfo,
  getPlayerGame,
  updateUserNickName,
  joinUserGame,
} from "../../app/localStorage";
import Loader from "react-loader-spinner";

const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;

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

const getOpenSeat = (gameInfo: any): string | null => {
  const players: ServerPlayerMetadata[] = gameInfo.players;
  const openSeatsOrderedByPlayerID = players
    .filter((p) => !p.name)
    .sort((p) => p.id);
  const nextOpenSeat = openSeatsOrderedByPlayerID[0];
  if (nextOpenSeat) {
    return String(nextOpenSeat.id);
  }
  return null;
};

const getSeatedPlayerIDForNickname = (
  gameInfo: any,
  nickname: string
): string | null => {
  const players: ServerPlayerMetadata[] = gameInfo.players;
  const existingSeatForNickname = players.find(({ name }) => name === nickname);
  if (existingSeatForNickname) {
    return String(existingSeatForNickname.id);
  }
  return null;
};

const getExistingOrNewPlayerID = (gameInfo: any, nickname: string): string => {
  const playerID =
    getSeatedPlayerIDForNickname(gameInfo, nickname) || getOpenSeat(gameInfo);
  if (!playerID) {
    throw new Error("Game is already full");
  }
  return playerID;
};

const postToJoinGame = async (gameID: string | undefined, nickname: string) => {
  if (!gameID) {
    throw new Error("Missing gameID in JoinGame");
  }

  const gameInfo = await getGameInfo(gameID);

  const playerID = getExistingOrNewPlayerID(gameInfo, nickname);

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

  updateUserNickName(nickname);

  joinUserGame(gameID, playerID, playerCredentials);

  //TODO:WORK ZONE
  return true;
  // TODO: no real error handling on this returning true
};

const JoinGame = () => {
  const { gameID } = useParams();
  const [nickname, setNickname] = useState(getUserInfo().nickname);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const gameInfo = getPlayerGame(gameID);

  useEffect(() => {
    if (gameInfo?.playerID && gameInfo?.playerCredentials) {
      setJoinSuccess(true);
    }
  }, [gameInfo, gameID]);

  useEffect(() => {
    if (loading) {
      (async function asyncWrapper() {
        try {
          const postSuccess = await postToJoinGame(gameID, nickname);
          if (postSuccess) setJoinSuccess(true);
        } catch (err) {
          setJoinError(`Failed to join ${gameID}`);
          setLoading(false);
        }
      })();
    }
  }, [loading, gameID, nickname]);

  return (
    <div className={styles.form}>
      {joinSuccess && <Redirect to={`/game/${gameID}`} />}
      <img className={styles.tileBagImg} src={tileBagImg} alt="tile bag" />
      <h3 className={styles.joinTitle}>Would you like to join</h3>
      <h4 className={styles.joinDetails}>
        the <span className={styles.rabbleName}>Rabble</span> at game:{" "}
        <span className={styles.joinGameID}>{gameID} ?</span>
      </h4>
      {joinError ? (
        <h4 style={{ color: "red" }}>{joinError}</h4>
      ) : (
        <div className={styles.inputGroupContainer}>
          {loading ? (
            <Loader type="Grid" color="#00BFFF" height={100} width={100} />
          ) : (
            <>
              <label>Enter Your Nickname</label>
              <input
                name="nickname"
                value={nickname}
                onChange={(ev) => setNickname(ev.target.value)}
                placeholder="TommyTuTone"
              />
              <Button
                content="join"
                onClick={() => {
                  setLoading(true);
                }}
                textColor="#fff5e2"
              ></Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JoinGame;
