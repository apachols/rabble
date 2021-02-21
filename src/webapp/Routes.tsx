import React  from "react";

import Rabble from "./features/rabble";
import Create from "./features/create";
import Join from "./features/join";
import AuthCallback from "./features/auth";

import PreAuthentication from "./features/auth/pre";
import PostAuthentication from "./features/auth/post";

import Home from "./features/home";

import { Switch, Route } from "react-router-dom";

import { useAuth } from "react-use-auth";

function Game() {
  return <Rabble />;
}

const Routes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return (
      <Switch>
        <Route path="/">
          <PreAuthentication />
        </Route>
      </Switch>
    )
  }
  return (
    <Switch>
      <Route path="/post-authentication">
        <PostAuthentication />
      </Route>
      <Route path="/auth-callback">
        <AuthCallback />
      </Route>
      <Route path="/game/:gameID">
        <Game />
      </Route>
      <Route path="/create">
        <Create />
      </Route>
      <Route path="/join/:gameID">
        <Join />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

export default Routes;