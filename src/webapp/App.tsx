import React from "react";
import "./App.css";
import Navbar from "./features/navbar/navbar";
import Rabble from "./features/rabble";
import Create from "./features/create";
import Join from "./features/join";
import AuthCallback from "./features/auth";
import PreAuthentication from "./features/auth/pre";
import PostAuthentication from "./features/auth/post";
import Home from "./features/home";
import Theme from "./features/rabble/components/Theme";
import RabbleLogo from "./features/rabble_logo/rabbleLogo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { AuthConfig } from "react-use-auth";
// @ts-ignore
import { Auth0 } from "react-use-auth/auth0";

function Game() {
  return <Rabble />;
}

const isTouch = navigator.maxTouchPoints || navigator.msMaxTouchPoints;

const dndDesktopProps = {
  backend: HTML5Backend,
};

const dndTouchProps = {
  backend: TouchBackend,
  options: { enableHoverOutsideTarget: true, enableMouseEvents: true },
};

interface RoutesProps extends RouteComponentProps<any> {}
const Routes = withRouter((props: RoutesProps) => (
  <AuthConfig
    navigate={props.history.push}
    authProvider={Auth0}
    params={{
      redirectUri: "http://localhost:3000/auth-callback",
      domain: process.env?.REACT_APP_AUTH_DOMAIN,
      clientID: process.env?.REACT_APP_AUTH_CLIENT_ID
    }}
  >
    <Switch>
    <Route path="/pre-authentication">
        <PreAuthentication />
      </Route>
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
  </AuthConfig>
));


export default function App() {
  return (
    <Theme>
      <DndProvider {...(isTouch ? dndTouchProps : dndDesktopProps)}>
        <Router>
          <div className="App">
            <RabbleLogo />
            <Navbar />
            <Routes />
          </div>
        </Router>
      </DndProvider>
    </Theme>
  );
}
