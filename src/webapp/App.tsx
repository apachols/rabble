import React from "react";
import "./App.css";
import Rabble from "./features/rabble";
import Create from "./features/create";
import Join from "./features/join";
import Home from "./features/home";
import Theme from "./features/rabble/components/Theme";
import Navbar from "./features/navbar/navbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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

export default function App() {
  return (
    <Theme>
      <DndProvider {...(isTouch ? dndTouchProps : dndDesktopProps)}>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
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
          </div>
        </Router>
      </DndProvider>
    </Theme>
  );
}
