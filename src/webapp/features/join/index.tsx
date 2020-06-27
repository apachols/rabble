import React, { useState, useEffect } from "react";
import styles from "./join.module.css";
import { useHistory, useParams } from "react-router-dom";
import {
  getUserInfo,
  getPlayerGame
} from "../../app/localStorage";
import Loader from "react-loader-spinner";
import { postToJoinGame, redirectToGameView } from './join.actions';

const JoinGame = () => {
  const { gameID } = useParams();
  const history = useHistory();
  const [nickname, setNickname] = useState(getUserInfo().nickname);
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);

  const gameInfo = getPlayerGame(gameID);

  useEffect(() => {
    if (gameInfo?.playerID && gameInfo?.playerCredentials) {
      redirectToGameView(history, gameID);
    }
  }, [gameInfo, gameID]);

  useEffect(() => {
    if (loading) {
      (async function asyncWrapper() {
        try {
          await postToJoinGame(history, gameID, nickname);
        } catch (err) {
          setJoinError(`Failed to join ${gameID}`);
          setLoading(false);
        }
      })();
    }
  }, [loading, gameID, nickname]);

  return (
    <div className={styles.form}>
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
