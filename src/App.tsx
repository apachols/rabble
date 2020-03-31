import React from "react";
// import logo from "./logo.svg";
// import { Counter } from "./features/counter/Counter";
import "./App.css";
import TicTacToe from "./features/tictactoe";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TicTacToe />
      </header>
    </div>
  );
}

export default App;
