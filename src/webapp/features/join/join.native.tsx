import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-native";
import {
  getUserInfo,
  getPlayerGame
} from "../../app/asyncStorage";
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { postToJoinGame, redirectToGameView } from './join.actions';

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
