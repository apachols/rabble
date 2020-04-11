import React from "react";
import "./App.css";
import Rabble from "./features/rabble";
import Create from "./features/create";
import Join from "./features/join";
import Home from "./features/home";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Game() {
  return <Rabble />;
}

export default function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.setItem("userInfo", "");
                  window.location.reload();
                }}
              >
                clear local storage
              </button>
            </li>
          </ul>
        </nav>

        <header className="App-header">
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
        </header>
      </div>
    </Router>
  );
}
