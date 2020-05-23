import React from "react";
import "./App.css";
import Rabble from "./features/rabble";
import Create from "./features/create";
import Join from "./features/join";
import Home from "./features/home";
import Theme from "./features/rabble/components/Theme";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Game() {
  return <Rabble />;
}

export default function App() {
  return (
    <Theme>
      <Router>
        <div className="App">
          <nav>
            <ul className="Nav">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/create">Create</Link>
              </li>
            </ul>
          </nav>
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
    </Theme>
  );
}
