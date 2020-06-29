import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { NativeRouter as Router, Switch, Route, Link } from 'react-router-native';
import Create from './src/webapp/features/create/create.native';
import Join from './src/webapp/features/join/join.native';
import Game from './src/webapp/features/rabble/game.native';
import Home from './src/webapp/features/home/home.native';
import AppHeader from './native/components/AppHeader';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from "react-redux";
import { store } from "./src/webapp/app/store";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <AppHeader />
          <ScrollView contentContainerStyle={styles.container}>
            <Switch>
              <Route path="/game/:gameID" component={Game} />
              <Route path="/create" component={Create} />
              <Route path="/join/:gameID" component={Join} />
              <Route path="/" component={Home}>

              </Route>
            </Switch>
          </ScrollView>
        </Router>

      </Provider>
    </ThemeProvider>


  );
}

const theme:Theme = {
  ActivityIndicator: {
    size: "large",
    color: "#f00"
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
