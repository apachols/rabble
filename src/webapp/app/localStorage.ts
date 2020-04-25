const fixtureUserInfo = {
  nickname: "",
  games: {},
};

const fixtureGameInfo = {
  gameID: "",
  playerID: "",
  playerCredentials: "",
};

export const getUserInfo = (): UserInfo => {
  const rawUserInfo = localStorage.getItem("userInfo");
  if (rawUserInfo) {
    return JSON.parse(rawUserInfo);
  }
  return { ...fixtureUserInfo };
};

const updateUserInfo = (userInfo: UserInfo) => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

export const getPlayerGame = (gameID: string) => {
  const userInfo = getUserInfo();
  return userInfo.games[gameID];
};

export const updateUserNickName = (nickname: string) => {
  const userInfo = getUserInfo();
  userInfo.nickname = nickname;
  updateUserInfo(userInfo);
};

export const joinUserGame = (
  gameID: string,
  playerID: string,
  playerCredentials: string
) => {
  const userInfo = getUserInfo();
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
  updateUserInfo(userInfo);
};

export const createUserGame = (gameID: string) => {
  // If you create the game, you are player 0 (first turn)
  const playerID = "0";
  const userInfo = getUserInfo();
  userInfo.games[gameID] = { ...fixtureGameInfo, gameID, playerID };
  updateUserInfo(userInfo);
};

export const clearRecentGames = () => {
  const userInfo = getUserInfo();
  userInfo.games = {};
  updateUserInfo(userInfo);
};
