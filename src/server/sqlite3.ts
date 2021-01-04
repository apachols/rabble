import { Async } from "boardgame.io/internal";
import type { LogEntry, Server, State, StorageAPI } from "boardgame.io";
import db from "./db";
import { Metadata, State as StateModel, InitialState, Log } from "./db/models";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

interface Sqlite3Opts {
  filename?: string;
  logging: boolean;
  debug: boolean;
}

export enum DBTable {
  "Metadata" = "metadata",
  "State" = "state",
  "InitialState" = "initialState",
  "Log" = "log",
}

export const tables = [
  DBTable.Metadata,
  DBTable.State,
  DBTable.InitialState,
  DBTable.Log,
] as const;

export class Sqlite3Store extends Async {
  debug: boolean;
  logging: boolean;
  db: Sequelize;
  metadata = Metadata;
  state = StateModel;
  initialState = InitialState;
  log = Log;

  constructor(
    { filename, logging, debug }: Sqlite3Opts = { logging: false, debug: false }
  ) {
    super();
    this.debug = debug;
    this.logging = logging;
    this.db = db(filename);
    this.db.addModels([Metadata, StateModel, InitialState, Log]);
  }

  debugLog(ifDebug: () => void): void {
    if (this.debug) {
      ifDebug();
    }
  }

  async connect(): Promise<void> {
    this.debugLog(() => console.log("connect to DB"));
    await Promise.all([
      Metadata.sync(),
      StateModel.sync(),
      InitialState.sync(),
      Log.sync(),
    ]);
  }

  async createGame(
    gameID: string,
    opts: StorageAPI.CreateGameOpts
  ): Promise<void> {
    this.debugLog(() => console.log("create gameID", gameID));
    await Promise.all([
      Metadata.create({
        docID: gameID,
        docString: JSON.stringify(opts.metadata),
      }),
      StateModel.create({
        docID: gameID,
        docString: JSON.stringify(opts.initialState),
      }),
      InitialState.create({
        docID: gameID,
        docString: JSON.stringify(opts.initialState),
      }),
      Log.create({
        docID: gameID,
        docString: JSON.stringify({ log: [] }),
      }),
    ]);
  }

  async setState(
    gameID: string,
    state: State,
    deltalog?: LogEntry[]
  ): Promise<void> {
    this.debugLog(() => console.log("setState", gameID, state._stateID));
    const prevState = await StateModel.findOne({ where: { docID: gameID } });
    if (!prevState || prevState.getDocument()._stateID < state._stateID) {
      await StateModel.upsert({
        docID: gameID,
        docString: JSON.stringify(state),
      });
      // Also, maybe we can change logs here to write separate records?
      // Only if we change fetch to get them the right way
      if (this.logging && deltalog && deltalog.length > 0) {
        const newLog = [...deltalog];
        const prevLog = await Log.findOne({ where: { docID: gameID } });
        if (prevLog) {
          const { log } = prevLog.getDocument();
          newLog.push(...log);
        }
        const newDoc = { log: newLog };
        await Log.upsert({ docID: gameID, docString: JSON.stringify(newDoc) });
      }
    }
  }

  async setMetadata(
    gameID: string,
    metadata: Server.MatchData
  ): Promise<void> {
    this.debugLog(() => console.log("set metadata for gameID", gameID));
    const update = {
      docString: JSON.stringify(metadata),
    };
    const where = { docID: gameID };
    await Metadata.update(update, { where });
  }

  async fetch<O extends StorageAPI.FetchOpts>(
    gameID: string,
    opts: O
  ): Promise<StorageAPI.FetchResult<O>> {
    this.debugLog(() => console.log("fetch", gameID));
    const result = {} as StorageAPI.FetchFields;
    // For each fetch field included in the options object,
    // prepare a promise to pull and return its data
    const requests: Promise<void>[] = [];
    for (const table of tables) {
      if (!opts[table]) continue;
      const model = this[table];
      const where = { docID: gameID };
      const promise = model.findOne({ where }).then((instance) => {
        if (table === DBTable.Log) {
          result[table] = instance?.getDocument()?.log;
        } else {
          result[table] = instance?.getDocument();
        }
      });
      requests.push(promise);
    }
    await Promise.all(requests);
    return result;
  }

  async wipe(gameID: string): Promise<void> {
    this.debugLog(() => console.log("Wipe DB for gameID", gameID));
    const where = { where: { docID: gameID } };
    await Promise.all([
      Metadata.destroy(where),
      StateModel.destroy(where),
      InitialState.destroy(where),
      Log.destroy(where),
    ]);
  }

  async listGames(opts?: StorageAPI.ListGamesOpts): Promise<string[]> {
    this.debugLog(() => console.log("LIST GAMES FOR", opts?.gameName));
    const getDocIdsForDocs = (docs: Metadata[]) => {
      const ids: string[] = [];
      for (let doc of docs) {
        const id = doc?.getDataValue("docID");
        if (id) {
          ids.push(id);
        }
      }
      return ids;
    };
    if (opts?.gameName) {
      // TODO - remove this hack.
      // Either gameName is a field on Metadata, or... we can't really do sqlite.
      const docs = await Metadata.findAll({
        where: {
          docString: {
            [Op.like]: `%"gameName":"${opts.gameName}"%`,
          },
        },
      });
      return getDocIdsForDocs(docs);
    }
    const docs = await Metadata.findAll();
    return getDocIdsForDocs(docs);
  }
}
