import { Server } from "boardgame.io/server";

import { Sqlite3Store } from "./sqlite3";

import Rabble from "../game/rabble";

import loadWordList from "./loadWordList";

import dotenv from "dotenv";

import Router from "koa-router";
import koaBody from "koa-body";
import cors from "@koa/cors";

dotenv.config();

const prefixed = (returnThingToLog: any, original: any) =>
  function () {
    original(returnThingToLog(), ...arguments);
  };
const freshTimestamp = () =>
  new Date().toISOString().replace(/[TZ]/g, " ").substring(0, 23);

console.log = prefixed(freshTimestamp, console.log);
console.error = prefixed(freshTimestamp, console.error);

// The "run typescript server script with async await" situation could be better.
loadWordList(process.env.WORDLIST_PATH || "").then((wordlist) => {
  const server = Server({
    games: [Rabble(wordlist)],

    db: new Sqlite3Store({
      filename: `${process.env.FLATFILE_PATH}/rabble.db`,
    }),
  });

  const router = new Router();
  router.post("/client-logs", koaBody(), async (ctx: any) => {
    // "Sane" limit on what client can send us
    const logMessage = JSON.stringify(ctx.request.body).slice(0, 8192);
    console.warn("client-logs", logMessage);
    ctx.status = 204;
  });
  server.app.use(cors());
  server.app.use(router.routes()).use(router.allowedMethods());

  server.run({ port: 8000 });
});
