import fs from "fs";
import readline from "readline";

export const processFileStreamLines = (
  filename: string,
  procLine: (line: string) => void
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // createReadStream is... secretly asynchronous ಠ_ಠ
    // https://stackoverflow.com/questions/30386768/is-createreadstream-asynchronous
    const readStream = fs.createReadStream(filename, { encoding: "utf8" });
    readStream.on("error", err => {
      readStream.destroy();
      reject(err);
    });
    const lineReader = readline.createInterface(readStream);
    lineReader
      .on("line", (line: string) => {
        procLine(line);
      })
      .on("error", err => {
        readStream.destroy();
        reject(err);
      })
      .on("close", () => {
        resolve(true);
      });
  });
};

// Expected format is "WORD definition [meta]"
export const processLine = (wordList: WordList) => (line: string) => {
  const word = line.split(" ")[0];
  wordList[word] = 1;
  // list.add(word);
};

const loadWordList = async (filename: string): Promise<WordList> => {
  const wordlist: WordList = {};

  const success = await processFileStreamLines(filename, processLine(wordlist));
  if (success) {
    return wordlist;
  } else {
    return {};
  }
};

export default loadWordList;
