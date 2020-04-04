import { Server, FlatFile } from "boardgame.io/server";
// import TicTacToe from "../game/tictactoe";

import Rabble from "../game/rabble";

// console.log(Rabble.setup());

// import wordlist from "./wordlist";
// console.log(wordlist);

const server = Server({
  games: [Rabble],

  db: new FlatFile({
    dir: "/Users/adamp/git/rabble/tmp",
    logging: true
  })
});

const x = server.run(8000);

// console.log(server);
