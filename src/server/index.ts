import { Server, FlatFile } from "boardgame.io/server";
import TicTacToe from "../game/tictactoe";

// import wordlist from "./wordlist";
// console.log(wordlist);

const server = Server({
  games: [TicTacToe],

  db: new FlatFile({
    dir: "/Users/adamp/git/rabble/tmp",
    logging: true
  })
});

const x = server.run(8000);

console.log(server);
