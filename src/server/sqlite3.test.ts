import { Sqlite3Store } from "./sqlite3";
import { Metadata, State as StateModel, InitialState, Log } from "./db/models";
import type { Server, State, LogEntry } from "boardgame.io";

describe("connect", () => {
  const gameID = "game-id";
  const docWhereGameID = { where: { docID: gameID } };

  let store: Sqlite3Store;
  beforeAll(async () => {
    store = new Sqlite3Store();
  });

  it("registers models with the db", () => {
    expect(store.db.isDefined("Metadata")).toBe(true);
    expect(store.db.isDefined("State")).toBe(true);
    expect(store.db.isDefined("InitialState")).toBe(true);
    expect(store.db.isDefined("Log")).toBe(true);
  });

  it("does not have DB tables before connect", async () => {
    expect.assertions(1);
    try {
      await Metadata.findAll();
    } catch (err) {
      expect(err.message).toEqual("SQLITE_ERROR: no such table: Metadata");
    }
  });

  describe("tests with the same DB", () => {
    beforeAll(async () => {
      await store.connect();
    });

    it("creates DB tables if none exist", async () => {
      const allMeta = await Metadata.findAll();
      expect(allMeta).toEqual([]);
    });

    describe("createGame", () => {
      // Short circuits typing - State / Meta factories would be better
      const initialState = ({ G: "G", ctx: "ctx" } as unknown) as State;
      const metadata = { gameName: "A" } as Server.MatchData;
      beforeAll(async () => {
        await store.createGame(gameID, { initialState, metadata });
      });
      afterAll(async () => {
        await store.wipe(gameID);
      });
      it.each([[Metadata, StateModel, InitialState, Log]])(
        "creates model for game ID",
        async (model: any) => {
          const doc = await model.findOne(docWhereGameID);
          expect(doc?.getDataValue("docID")).toBe(gameID);
        }
      );
    });

    describe("fetch", () => {
      const fetchOpts = {
        state: true,
        log: true,
        metadata: true,
        initialState: true,
      };
      // Short circuits typing - State / Meta factories would be better
      const initialState = ({ G: "G", ctx: "ctx" } as unknown) as State;
      const metadata = { gameName: "A" } as Server.MatchData;
      beforeAll(async () => {
        await store.createGame(gameID, { initialState, metadata });
      });
      afterAll(async () => {
        await store.wipe(gameID);
      });
      it("fetches all data types for new game", async () => {
        const result = await store.fetch(gameID, fetchOpts);
        expect(result.metadata).toEqual(metadata);
        expect(result.initialState).toEqual(initialState);
        expect(result.state).toEqual(initialState);
        expect(result.log).toEqual([]);
      });
    });

    describe("setState", () => {
      // Short circuits typing - State / Meta factories would be better
      const stateOne = ({
        _stateID: 1,
      } as unknown) as State;
      const stateTwo = ({
        _stateID: 2,
      } as unknown) as State;
      const stateThree = ({
        _stateID: 3,
      } as unknown) as State;
      afterEach(async () => {
        await store.wipe(gameID);
      });
      it("creates new state if none exists", async () => {
        await store.setState(gameID, stateOne);
        const doc = await StateModel.findOne(docWhereGameID);
        expect(doc?.getDocument()).toEqual(stateOne);
      });
      it("updates if state exists and new stateid is greater", async () => {
        await store.setState(gameID, stateOne);
        await store.setState(gameID, stateTwo);
        const doc = await StateModel.findOne(docWhereGameID);
        expect(doc?.getDocument()).toEqual(stateTwo);
      });
      it("does not update if state exists and stateid is not greater", async () => {
        await store.setState(gameID, stateThree);
        await store.setState(gameID, stateTwo);
        const doc = await StateModel.findOne(docWhereGameID);
        expect(doc?.getDocument()).toEqual(stateThree);
      });

      describe("update log tests", () => {
        // Again, factories would be better here
        const logEntry = ({
          action: {},
          _stateID: 2,
          turn: 1,
          phase: "",
        } as unknown) as LogEntry;
        it("does not update log if no deltalog specified ", async () => {
          await store.setState(gameID, stateTwo);
          const log = await Log.findOne(docWhereGameID);
          expect(log).toBeNull();
        });
        it("does not update log if logging is turned off ", async () => {
          store.logging = false;
          const deltalog = [logEntry];
          await store.setState(gameID, stateTwo, deltalog);
          const log = await Log.findOne(docWhereGameID);
          expect(log).toBeNull();
        });
        it("updates log if deltalog specified", async () => {
          store.logging = true;
          const deltalog = [logEntry];
          await store.setState(gameID, stateTwo, deltalog);
          const log = await Log.findOne(docWhereGameID);
          expect(log).not.toBeNull();
          expect(log?.getDocument()).toEqual({ log: deltalog });
        });
      });
    });

    describe("setMetadata", () => {
      const metadata = { gameName: "A" } as Server.MatchData;
      beforeAll(async () => {});
      afterAll(async () => {});
      it("update silently fails if meta record does not exist...", async () => {
        await store.setMetadata(gameID, metadata);
        const doc = await Metadata.findOne(docWhereGameID);
        expect(doc).toBeNull();
      });
      it("update succeeds if meta record exists", async () => {
        await Metadata.create({ docID: gameID, docString: "{}" });
        await store.setMetadata(gameID, metadata);
        const doc = await Metadata.findOne(docWhereGameID);
        expect(doc?.getDocument()).toEqual(metadata);
      });
      afterEach(async () => {
        await store.wipe(gameID);
      });
    });

    describe("listGames", () => {
      const metaWithGameName = JSON.stringify({ gameName: "rabble" });
      it("returns empty if no games", async () => {
        const games = await store.listGames({});
        expect(games).toEqual([]);
      });
      describe("tests with cleanup", () => {
        afterEach(async () => {
          await Metadata.drop();
          await Metadata.sync();
        });
        it("returns games if no gameName", async () => {
          await Metadata.create({ docID: "one", docString: metaWithGameName });
          await Metadata.create({ docID: "two", docString: metaWithGameName });
          const games = await store.listGames({});
          expect(games).toEqual(["one", "two"]);
        });
        it("returns only matching games if gameName specified", async () => {
          await Metadata.create({ docID: "one", docString: metaWithGameName });
          await Metadata.create({ docID: "two", docString: "{}" });
          const games = await store.listGames({ gameName: "rabble" });
          expect(games).toEqual(["one"]);
        });
      });
    });
  });
});
