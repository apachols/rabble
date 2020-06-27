import AsyncStorage from '@react-native-community/async-storage';

const fixtureUserInfo = {
  nickname: "",
  games: {},
};

const fixtureGameInfo: UserGameInfo = {
  gameID: "",
  playerID: "",
  playerCredentials: "",
  scoreList: {},
  createdAt: new Date().toLocaleDateString("en-US"),
};

export const getUserInfo = async (): Promise<UserInfo> => {
  const rawUserInfo = await AsyncStorage.getItem("userInfo");
  if (rawUserInfo) {
    return JSON.parse(rawUserInfo);
  }
  return { ...fixtureUserInfo };
};

const updateUserInfo = async (userInfo: UserInfo) => {
  await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
};

export const getPlayerGame = async (gameID: string | undefined) => {
  if (!gameID) {
    throw new Error("Missing gameID in getPlayerGame");
  }
  const userInfo = await getUserInfo();
  return userInfo.games[gameID];
};

export const updateUserNickName = async (nickname: string) => {
  const userInfo = await getUserInfo();
  userInfo.nickname = nickname;
  await updateUserInfo(userInfo);
};

export const updatePlayerGame = async (
  gameID: string | undefined,
  updateGameInfo: any
) => {
  if (!gameID) {
    throw new Error("Missing gameID in getPlayerGame");
  }
  const userInfo = await getUserInfo();
  const gameInfo = {
    ...userInfo.games[gameID],
    ...updateGameInfo,
  };
  userInfo.games[gameID] = gameInfo;
  await updateUserInfo(userInfo);
};

export const joinUserGame = async (
  gameID: string,
  playerID: string,
  playerCredentials: string
) => {
  const userInfo = await getUserInfo();
  if (userInfo.games[gameID]) {
    userInfo.games[gameID] = {
      ...userInfo.games[gameID],
      playerID,
      playerCredentials,
    };
  } else {
    userInfo.games[gameID] = {
      ...fixtureGameInfo,
      gameID,
      playerID,
      playerCredentials,
    };
  }
  await updateUserInfo(userInfo);
};

export const createUserGame = async (gameID: string) => {
  // If you create the game, you are player 0 (first turn)
  const playerID = "0";
  const userInfo = await getUserInfo();
  userInfo.games[gameID] = { ...fixtureGameInfo, gameID, playerID };
  await updateUserInfo(userInfo);
};

export const clearRecentGames = async () => {
  const userInfo = await getUserInfo();
  userInfo.games = {};
  updateUserInfo(userInfo);
};

// TODO please 2 remove this
const login = async (
  nick: string,
  gameID: string,
  playerID: string,
  creds: string
) => {
  const gameInfo = `{"gameID":"${gameID}","playerID":"${playerID}","playerCredentials":"${creds}"}`;
  await AsyncStorage.setItem(
    "userInfo",
    `{"nickname":"${nick}","games":{"${gameID}":${gameInfo}}}`
  );
};
// @ts-ignore
// window.rabble = { login };
