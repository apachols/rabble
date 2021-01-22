import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./join.module.css";
import { useParams, Redirect } from "react-router-dom";

import {
  getUserInfo,
  getPlayerGame,
  updateUserNickName,
  joinUserGame,
} from "../../app/localStorage";
import Loader from "react-loader-spinner";

const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;

// TO TRY:
// 1. pass the history object through the useEffect and posttojoin/redirectToGameView -> something in the chain of passing skipped a beat, seems like it bailed on the post.
// 2. bring redirecttogameview into the component for access to history - worked in create, now for join
//

//TODO:WORK ZONE - removed redirecttogameview in favor of setting bool and using redirect component.
// const redirectToGameView = (gameID: string | undefined) => {
//   window.location.href = `/game/${gameID}`;
// };
//TODO:WORK ZONE

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
  // redirectToGameView(gameID);
  return true;
  // TODO: no real error handling on this returning true
  //TODO:WORK ZONE
};

const JoinGame = () => {
  const { gameID } = useParams();
  const [nickname, setNickname] = useState(getUserInfo().nickname);
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);

  //TODO:WORK ZONE
  const [joinSuccess, setJoinSuccess] = useState(false);
  //TODO:WORK ZONE

  const gameInfo = getPlayerGame(gameID);

  useEffect(() => {
    if (gameInfo?.playerID && gameInfo?.playerCredentials) {
      //TODO:WORK ZONE
      // redirectToGameView(gameID);
      setJoinSuccess(true);
      //TODO:WORK ZONE
    }
  }, [gameInfo, gameID]);

  useEffect(() => {
    if (loading) {
      (async function asyncWrapper() {
        try {
          //TODO:WORK ZONE
          // await postToJoinGame(gameID, nickname);
          const postSuccess = await postToJoinGame(gameID, nickname);
          if (postSuccess) setJoinSuccess(true);
          //TODO:WORK ZONE
        } catch (err) {
          setJoinError(`Failed to join ${gameID}`);
          setLoading(false);
        }
      })();
    }
  }, [loading, gameID, nickname]);

  return (
    <div className={styles.form}>
      {/* //TODO:WORK ZONE */}
      {joinSuccess && <Redirect to={`/game/${gameID}`} />}
      {/* //TODO:WORK ZONE */}
      <h3>Join game {gameID}</h3>
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
              />
              <button
                onClick={() => {
                  setLoading(true);
                }}
              >
                join
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JoinGame;
