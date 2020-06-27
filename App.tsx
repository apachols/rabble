import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { NativeRouter as Router, Switch, Route, Link } from 'react-router-native';
import Create from './src/webapp/features/create/create.native';
import Join from './src/webapp/features/join/join.native';
import AppHeader from './native/components/AppHeader';
import { Button, ThemeProvider } from 'react-native-elements';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.container}>
          <Switch>
            <Route path="/game/:gameID">
              <Text>GAMEGAME</Text>
            </Route>
            <Route path="/create" component={Create} />
            <Route path="/join/:gameID" component={Join} />
            <Route path="/">
              <View>
                <Text>Welcome to Rabble</Text>
                <Link to="/"><Text>Home</Text></Link>
                <Link to="/create"><Text>CREATE</Text></Link>
                {/* <Button title="Create"><Link to="/create"></Link></Button> */}

              </View>
            </Route>
          </Switch>
        </ScrollView>
      </Router>
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
