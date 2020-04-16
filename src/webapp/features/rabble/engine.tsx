import { Client } from "boardgame.io/react";
import GameBoard from "./GameBoard";
import Rabble from "../../../game/rabble";
import { SocketIO } from "boardgame.io/multiplayer";

const SOCKET_ROOT = `${process.env?.REACT_APP_SOCKET_ROOT || ""}`;

const Engine = Client({
  debug: false,
  game: Rabble({}),
  board: GameBoard,
  multiplayer: SocketIO({ server: SOCKET_ROOT }),
});

export default Engine;
