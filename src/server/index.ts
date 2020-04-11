import { Server, FlatFile } from "boardgame.io/server";

import Rabble from "../game/rabble";

import loadWordList from "./loadWordList";

// The "run typescript server script with async await" situation could be better.
loadWordList("./data/NSWL2018.txt").then(wordlist => {
  console.log(wordlist);

  const server = Server({
    games: [Rabble(wordlist)],

    db: new FlatFile({
      dir: "/c/Users/lorbe/git/rabble/tmp",
      logging: true
    })
  });

  const x = server.run(8000);
});
