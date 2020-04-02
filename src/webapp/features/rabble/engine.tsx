import { Client } from "boardgame.io/react";
import GameBoard from "./GameBoard";
import Rabble from "../../../game/rabble";
import { SocketIO } from "boardgame.io/multiplayer";

const Engine = Client({
  game: Rabble,
  board: GameBoard,
  multiplayer: SocketIO({ server: "localhost:8000" })
});

export default Engine;
