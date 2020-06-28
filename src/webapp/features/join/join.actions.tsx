import axios from "axios";
import {
  updateUserNickName,
  joinUserGame,
} from "../../app/asyncStorage";

const API_ROOT = `${process.env.REACT_APP_API_ROOT || ""}`;

export const redirectToGameView = (history: any, gameID: string | undefined) => {
  history.push(`/game/${gameID}`);
};

export const getGameInfo = async (gameID: string) => {
  const getResult = await axios({
    method: "get",
    headers: {
      "content-type": "application/json",
    },
    url: `${API_ROOT}/games/rabble/${gameID}`,
  });

  return getResult.data;
};

export const getOpenSeat = (gameInfo: any): string | null => {
  const players: ServerPlayerMetadata[] = gameInfo.players;
  const openSeatsOrderedByPlayerID = players
    .filter((p) => !p.name)
    .sort((p) => p.id);
  const nextOpenSeat = openSeatsOrderedByPlayerID[0];
  if (nextOpenSeat) {
    return String(nextOpenSeat.id);
  }
  return null;
};

export const getSeatedPlayerIDForNickname = (
  gameInfo: any,
  nickname: string
): string | null => {
  const players: ServerPlayerMetadata[] = gameInfo.players;
  const existingSeatForNickname = players.find(({ name }) => name === nickname);
  if (existingSeatForNickname) {
    return String(existingSeatForNickname.id);
  }
  return null;
};

export const getExistingOrNewPlayerID = (gameInfo: any, nickname: string): string => {
  const playerID =
    getSeatedPlayerIDForNickname(gameInfo, nickname) || getOpenSeat(gameInfo);
  if (!playerID) {
    throw new Error("Game is already full");
  }
  return playerID;
};

export const postToJoinGame = async (history: any, gameID: string | undefined, nickname: string) => {
  if (!gameID) {
    throw new Error("Missing gameID in JoinGame");
  }

  const gameInfo = await getGameInfo(gameID);
  const playerID = getExistingOrNewPlayerID(gameInfo, nickname);

  console.log(`gameID: ${gameID} playerID: ${playerID} name: ${nickname}`);
  const postResult = await axios({
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    url: `${API_ROOT}/games/rabble/${gameID}/join`,
    data: {
      playerID,
      playerName: nickname,
    },
  });

  const { playerCredentials } = postResult.data;
  await updateUserNickName(nickname);
  await joinUserGame(gameID, playerID, playerCredentials);
  redirectToGameView(history, gameID);
};
