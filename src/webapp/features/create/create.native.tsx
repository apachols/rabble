import React, { useState } from "react";
import { postToCreateGame } from "./create.actions";
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useHistory } from "react-router-native";

const CreateGame = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
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
          return await postToCreateGame(history);
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
