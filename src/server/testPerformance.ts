import { performance, PerformanceObserver } from "perf_hooks";

/**
 *
 * Weird - did not expect plain object to outperform Set... Except for not found.

import testWordListPerformance from "./src/server/testPerformance";
import loadWordList from "./src/server/loadWordList";

loadWordList('./data/NSWL2018.txt').then(wl => {
  testWordListPerformance('21402175', 123456000, wl);
})

  Javascript Object:
    testWordListPerformance('ZOO', 123000, wl);
      > word scored 123000
      3.046396

    testWordListPerformance('ZOOGEOGRAPHICAL', 123000, wl);
      > word scored 123000
      3.215665

    testWordListPerformance('ZOOGEOGRAPHICAL', 123456000, wl);
      > word scored 123456000
      1475.762916

    testWordListPerformance('21402175', 123456000, wl);
      > word scored -123456000
      11536.97311

  Javascript Set:
    testWordListPerformance('ZOO', 123000, wl);
      > word scored 123000
      4.019277

    testWordListPerformance('ZOOGEOGRAPHICAL', 123000, wl);
      > word scored 123000
      8.575151

    testWordListPerformance('ZOOGEOGRAPHICAL', 123456000, wl);
      > word scored 123456000
      6954.469032

    testWordListPerformance('21402175', 123456000, wl);
      > word scored -123456000
      1352.095968
 *
 */

const obs = new PerformanceObserver(list => {
  console.log(list.getEntries()[0].duration);
  obs.disconnect();
});
obs.observe({ entryTypes: ["function"] });

const testWordListPerformance = (
  testWord: string,
  iterations: number,
  wordlist: WordList
) => {
  let score = 0;
  for (let ii = 0; ii < iterations; ii++) {
    const found = wordlist[testWord] === 1;
    // const found = wordlist.has(testWord);
    if (found) {
      score += 1;
    } else {
      score -= 1;
    }
  }
  console.log(`word scored ${score}`);
};

export default performance.timerify(testWordListPerformance);
