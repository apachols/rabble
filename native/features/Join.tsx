import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-native";
import {
  getUserInfo,
  getPlayerGame,
  updateUserNickName,
  joinUserGame,
} from "../app/asyncStorage";
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';

// const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;
const API_ROOT = 'http://192.168.0.5:8000';

const redirectToGameView = (history: any, gameID: string | undefined) => {
  // TODO, react router recommends doing this with <Redirect> instead
  history.push(`/game/${gameID}`);
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

const postToJoinGame = async (history: any, gameID: string | undefined, nickname: string) => {
  if (!gameID) {
    throw new Error("Missing gameID in JoinGame");
  }

  const gameInfo = await getGameInfo(gameID);

  const playerID = getExistingOrNewPlayerID(gameInfo, nickname);

  console.log(`gameID: ${gameID} playerID: ${playerID} name: ${nickname}`);
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

  await updateUserNickName(nickname);

  await joinUserGame(gameID, playerID, playerCredentials);

  redirectToGameView(history, gameID);
};


const JoinGame = () => {
  const { gameID } = useParams();
  const history = useHistory();
  // @todo not sure if this async part is good
  // 
  const [nickname, setNickname] = useState("");
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkGameInfo = async () => {
    const gameInfo = await getPlayerGame(gameID);

    if (gameInfo?.playerID && gameInfo?.playerCredentials) {
      redirectToGameView(history, gameID);
    }
  };
  useEffect(() => {
    console.log('checkin game info..');
    checkGameInfo();
  });
  
  const checkUserInfo = async () => {
    const userInfo = await getUserInfo();
    if (userInfo.nickname) {
      console.log('calling set nickname:', userInfo.nickname);
      setNickname(userInfo.nickname);
    }
  };

  useEffect(() => {
    if (!nickname) {
      checkUserInfo();
    };    
  });
  
  useEffect(() => {
    if (loading) {
      (async function asyncWrapper() {
        try {
          await postToJoinGame(history, gameID, nickname);
        } catch (err) {
          console.error(err);
          setJoinError(`Failed to join ${gameID}`);
          setLoading(false);
        }
      })();
    }
  }, [loading, gameID, nickname, history]);

  return (
    <View>
      <Text>Join game {gameID}</Text>
      {joinError ? (
        <Text style={{ color: "red" }}>{joinError}</Text>
      ) : (
          <View>
            {loading ? (
              <ActivityIndicator />
            ) : (
                <>
                  <Input
                    placeholder="person"
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    style={styles.input}
                    onChangeText={value => {
                      console.log('updating name:', value);
                      setNickname(value);
                    }}
                  />
                  <Button title="Start game" onPress={() => {
                    setLoading(true);
                  }} />
                </>
              )}
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {},
  form: {
    margin: "0 auto",
  },
  inputGroupContainer: {
    textAlign: "left",
  }
});

export default JoinGame;
