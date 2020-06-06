// For now, test this by running in the REPL.
// We need to see if we can even get this working...

import db from "./src/server/db";
import {
  Metadata,
  State as StateModel,
  InitialState,
  Log,
} from "./src/server/db/models";
const DB = db("rabbletest.db");
const models = [Metadata, StateModel, InitialState, Log];
DB.addModels(models);

// Nuke entire DB for maximum freshness
Promise.all(models.map((m) => m.drop())).then(() => {
  console.log("=-=-=-=-=-= DROP COMPLETE");
});

// TEST CONNECT
Promise.all(models.map((m) => m.sync())).then(() => {
  console.log("=-=-=-=-=-= SYNC COMPLETE");
});

const gameID = "246810";
const docWhereGameID = { where: { docID: gameID } };
const opts = {
  metadata: { ping: "metadata" },
  initialState: { _stateID: 2 },
};

// TEST CREATE
Promise.all([
  Metadata.create({
    docID: gameID,
    docString: JSON.stringify(opts.metadata),
  }),
  StateModel.create({
    docID: gameID,
    docString: JSON.stringify({ _stateID: 2 }),
  }),
  InitialState.create({
    docID: gameID,
    docString: JSON.stringify(opts.initialState),
  }),
  Log.create({
    docID: gameID,
    docString: JSON.stringify({ log: [{ logmsg: 0 }] }),
  }),
]).then(() => {
  console.log("=-=-=-=-=-= CREATE COMPLETE");
});

for (let m of models) {
  m.findOne(docWhereGameID).then((instance) => {
    const target = instance?.get({ plain: true });
    console.log("=-=-=-=-=-= found", target);
  });
}

// TEST UPDATE
const gameName = "rabble";
const update2 = {
  docString: JSON.stringify({ gameName }),
};
Metadata.update(update2, docWhereGameID).then(() => {
  console.log("=-=-=-=-=-= UPDATE COMPLETE");
});

import { Op } from "sequelize";

// TEST listGames
Metadata.findOne({
  where: {
    docString: {
      [Op.like]: `%"gameName":"${gameName}"%`,
    },
  },
}).then((instance) => {
  const target = instance?.get({ plain: true });
  console.log("=-=-=-=-=-= found", target);
});

// TEST FETCH
Metadata.findOne(docWhereGameID).then((instance) => {
  const result = {
    metadata: instance?.getDocument(),
  };
  console.log("=-=-=-=-=-=-= META", result);
});

Log.findOne(docWhereGameID).then((instance) => {
  const result = {
    log: instance?.getDocument().log,
  };
  console.log("=-=-=-=-=-=-= LOG", result);
});

// TEST setState
// Case 1, invalid old state gets rejected
const invalidState = {
  _stateID: 1,
};
StateModel.findOne(docWhereGameID).then((prevState) => {
  if (prevState && prevState.getDocument()._stateID > invalidState._stateID) {
    console.log("INVALID PRIOR STATE");
  }
});
// Case 2, UPSERT with previous existing state
const validState = {
  _stateID: 3,
};
StateModel.findOne(docWhereGameID).then((prevState) => {
  if (!prevState || prevState.getDocument()._stateID < validState._stateID) {
    StateModel.upsert({
      docID: gameID,
      docString: JSON.stringify(validState),
    }).then(() => {
      console.log("=-=-=-=-=-= UPSERT COMPLETE previous exist");
    });
  }
});

// Test inserting new logs merged into old logs
const deltaLog = [{ logmsg: 1 }];
Log.findOne({ where: { docID: gameID } }).then((prevLog) => {
  if (prevLog) {
    const prevDoc = prevLog.getDocument();
    const newLog = [...prevDoc.log, ...deltaLog];
    prevLog.docString = JSON.stringify({ ...prevDoc, log: newLog });
    prevLog.save().then(() => {
      console.log("=-=-=-=-=-=-=-=-=-=-=- UPDATE LOG COMPLETE");
    });
  }
});

// TEST WIPE
Promise.all(models.map((m) => m.destroy(docWhereGameID))).then(() => {
  console.log("=-=-=-=-=-= DESTROY COMPLETE");
});
// Test case 3, upsert where record doesn't exist
StateModel.findOne(docWhereGameID).then((prevState) => {
  if (!prevState || prevState.getDocument()._stateID < validState._stateID) {
    StateModel.upsert({
      docID: gameID,
      docString: JSON.stringify(validState),
    }).then(() => {
      console.log("=-=-=-=-=-= UPSERT COMPLETE previous missing");
    });
  }
});
