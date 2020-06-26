import React, { useState } from "react";
// import styles from "./create.module.css";
import axios from "axios";
import { createUserGame } from "../app/asyncStorage";
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Redirect } from 'react-router';

// const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;
const API_ROOT = 'http://192.168.0.5:8000';

const postToCreateGame = async (history:Object) => {
  console.log('posting to create:');
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
  console.log('got result:', gameID);

  if (gameID) {
    await createUserGame(gameID);
  } else {
    throw new Error("Game ID not returned from server");
  }
  console.log(`@TODO you hardcoded your ip! REACT_APP_API_ROOT: ${process.env?.REACT_APP_API_ROOT}`)
  console.log("got a gameID:", gameID);

  // @TODO do this in webapp version
  // return <Redirect to={`/join/${gameID}`}/>;
  history.push(`/join/${gameID}`);
};

type CreateGameProps = {
  history: Object
};

const CreateGame = (props: CreateGameProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <View
      style={{
        flexDirection: "row",
        height: 100,
        padding: 20
      }}
    >
      {loading ? 
      (<ActivityIndicator size="large" color={styles.loading.color} />) : 
      (<Button title="Create a new game"
        onPress={ async () => {
          setLoading(true);
          return await postToCreateGame(props.history);
        }}
      />)} 
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    color: '#00BFFF'
  }
});


export default CreateGame;
