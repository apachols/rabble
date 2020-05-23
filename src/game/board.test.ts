import {
  getPreviousLocation,
  getNextLocation,
  getDistance,
  HORIZONTAL,
  VERTICAL,
} from "./board";

describe("getPreviousLocation", () => {
  it.each`
    location | direction     | result
    ${0}     | ${HORIZONTAL} | ${null}
    ${1}     | ${HORIZONTAL} | ${0}
    ${14}    | ${HORIZONTAL} | ${13}
    ${15}    | ${HORIZONTAL} | ${null}
    ${0}     | ${VERTICAL}   | ${null}
    ${14}    | ${VERTICAL}   | ${null}
    ${15}    | ${VERTICAL}   | ${0}
    ${224}   | ${VERTICAL}   | ${209}
  `("provides correct previous location", ({ location, direction, result }) => {
    expect(getPreviousLocation(location, direction)).toEqual(result);
  });
  it.each`
    location | direction     | result
    ${0}     | ${null}       | ${null}
    ${-1}    | ${HORIZONTAL} | ${null}
    ${225}   | ${HORIZONTAL} | ${null}
    ${-1}    | ${VERTICAL}   | ${null}
    ${225}   | ${VERTICAL}   | ${null}
  `("provides bounds checking", ({ location, direction, result }) => {
    expect(getPreviousLocation(location, direction)).toEqual(result);
  });
});

describe("getNextLocation", () => {
  it.each`
    location | direction     | result
    ${0}     | ${HORIZONTAL} | ${1}
    ${14}    | ${HORIZONTAL} | ${null}
    ${15}    | ${HORIZONTAL} | ${16}
    ${224}   | ${HORIZONTAL} | ${null}
    ${0}     | ${VERTICAL}   | ${15}
    ${14}    | ${VERTICAL}   | ${29}
    ${210}   | ${VERTICAL}   | ${null}
    ${224}   | ${VERTICAL}   | ${null}
  `("provides correct next location", ({ location, direction, result }) => {
    expect(getNextLocation(location, direction)).toEqual(result);
  });
  it.each`
    location | direction     | result
    ${0}     | ${null}       | ${null}
    ${-1}    | ${HORIZONTAL} | ${null}
    ${225}   | ${HORIZONTAL} | ${null}
    ${-1}    | ${VERTICAL}   | ${null}
    ${225}   | ${VERTICAL}   | ${null}
  `("provides bounds checking", ({ location, direction, result }) => {
    expect(getNextLocation(location, direction)).toEqual(result);
  });
  describe("getDistance", () => {
    it.each`
    source  | destination  | direction     | result
    ${0}    | ${15}         | ${VERTICAL} | ${1}
    ${0}    | ${30}         | ${VERTICAL} | ${2}
    ${25}    | ${26}        | ${HORIZONTAL} | ${1}
    ${25}    | ${27}        | ${HORIZONTAL} | ${2} 
  `("provides correct distance", ({ source, destination, direction, result }) => {
      expect(getDistance(source, destination, direction)).toEqual(result);
    });
    it.each`
    source  | destination  | direction     | result
    ${-1}   | ${5}         | ${HORIZONTAL} | ${null}
    ${225}  | ${5}         | ${HORIZONTAL} | ${null}
    ${5}    | ${-1}        | ${HORIZONTAL} | ${null}
    ${5}    | ${255}       | ${HORIZONTAL} | ${null} 
  `("provides bounds checking", ({ source, destination, direction, result }) => {
      expect(getDistance(source, destination, direction)).toEqual(result);
    });
  });
});
