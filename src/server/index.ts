import { Server, FlatFile } from "boardgame.io/server";

import Rabble from "../game/rabble";

import loadWordList from "./loadWordList";

import dotenv from "dotenv";

dotenv.config();

// The "run typescript server script with async await" situation could be better.
loadWordList(process.env.WORDLIST_PATH || "").then(wordlist => {
  const server = Server({
    games: [Rabble(wordlist)],

    db: new FlatFile({
      dir: process.env.FLATFILE_PATH || "",
      logging: true
    })
  });

  const x = server.run(8000);
});
