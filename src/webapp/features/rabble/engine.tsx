import { Client } from "boardgame.io/react";
import GameBoard from "./GameBoard";
import Rabble from "../../../game/rabble";
import { SocketIO } from "boardgame.io/multiplayer";

const server = `https://${window.location.hostname}/`;

console.log(server);

const Engine = Client({
  game: Rabble({}),
  board: GameBoard,
  multiplayer: SocketIO({ server })
});

export default Engine;
