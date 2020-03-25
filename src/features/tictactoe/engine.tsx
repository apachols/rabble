import { Client } from "boardgame.io/react";
// import { Local } from "boardgame.io/multiplayer";
import GameBoard from "./GameBoard";
import TicTacToe from "./game";
import { SocketIO } from "boardgame.io/multiplayer";

const Engine = Client({
  game: TicTacToe,
  board: GameBoard,
  multiplayer: SocketIO({ server: "localhost:8000" })
});

export default Engine;
