import React from "react";
import "./App.css";
import Rabble from "./features/rabble";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Home() {
  return <h2>Home</h2>;
}

function Game() {
  return (
    <div>
      <h2>Rabble</h2>
      <Rabble />
    </div>
  );
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
              <Link to="/game">Rabble</Link>
            </li>
          </ul>
        </nav>

        <header className="App-header">
          <Switch>
            <Route path="/game">
              <Game />
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
