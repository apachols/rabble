import { Async } from "boardgame.io/internal";
import type { LogEntry, Server, State, StorageAPI } from "boardgame.io";
import db from "./db";
import { Metadata, State as StateModel, InitialState, Log } from "./db/models";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

interface Sqlite3Opts {
  filename?: string;
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
  db: Sequelize;
  metadata = Metadata;
  state = StateModel;
  initialState = InitialState;
  log = Log;

  constructor({ filename }: Sqlite3Opts = {}) {
    super();
    this.db = db(filename);
    this.db.addModels([Metadata, StateModel, InitialState, Log]);
  }

  async connect(): Promise<void> {
    // required by boardgame.io
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
    const prevState = await StateModel.findOne({ where: { docID: gameID } });
    if (!prevState || prevState.getDocument()._stateID < state._stateID) {
      await StateModel.create({
        docID: gameID,
        docString: JSON.stringify(state),
      });
      // Also, maybe we can change logs here to write separate records?
      if (deltalog && deltalog.length > 0) {
        const prevLog = await Log.findOne({ where: { docID: gameID } });
        if (prevLog) {
          const prevDoc = prevLog.getDocument();
          const newLog = [...prevDoc.log, ...deltalog];
          prevLog.docString = JSON.stringify({ ...prevDoc, log: newLog });
          await prevLog.save();
        }
      }
    }
  }

  async setMetadata(
    gameID: string,
    metadata: Server.GameMetadata
  ): Promise<void> {
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
    const result = {} as StorageAPI.FetchFields;

    const requests: Promise<void>[] = [];
    // For each fetch field included in the options object,
    // prepare a promise to pull and return its data
    for (const table of tables) {
      if (!opts[table]) continue;

      const model = this[table];
      const where = { docID: gameID };
      const promise = model.findOne({ where }).then((instance) => {
        if (table === DBTable.Log) {
          // Handle log storage format to return array
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
    const where = { where: { docID: gameID } };
    await Promise.all([
      Metadata.destroy(where),
      StateModel.destroy(where),
      InitialState.destroy(where),
      Log.destroy(where),
    ]);
  }

  async listGames(opts?: StorageAPI.ListGamesOpts): Promise<string[]> {
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
      return docs.map((d) => d.id);
    }
    const docs = await Metadata.findAll();
    return docs.map((d) => d.id);
  }
}
