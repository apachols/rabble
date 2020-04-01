import { processLine } from "./loadWordList";
import { processFileStreamLines } from "./loadWordList";

describe("processLine", () => {
  test("puts everything before the space into the word list", () => {
    const wl: WordList = {};
    processLine(wl)("WORDY is a word");
    expect(wl["WORDY"]).toEqual(1);
  });
});

describe("processFileStreamLines", () => {
  const fakeProcLines = (l: string) => {};

  test("rejects when file not found", async () => {
    expect.assertions(1);
    try {
      await processFileStreamLines("/asdf/xzcv", fakeProcLines);
    } catch (err) {
      expect(err.message).toEqual(
        "ENOENT: no such file or directory, open '/asdf/xzcv'"
      );
    }
  });

  xtest("rejects when stream has error", () => {
    expect(2 + 2).toEqual(4); // TODO
  });

  xtest("calls process lines when stream ok", () => {
    expect(2 + 2).toEqual(4); // TODO
  });
});
