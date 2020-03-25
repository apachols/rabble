import { Server } from "boardgame.io/server";
import TicTacToe from "./features/tictactoe/game";

// src/server.js
const server = Server({ games: [TicTacToe] });
const x = server.run(8000);
