const fixtureUserInfo = {
  nickname: "",
  games: []
};

const getUserInfo = (): UserInfo => {
  const rawUserInfo = localStorage.getItem("userInfo");
  if (rawUserInfo) {
    return JSON.parse(rawUserInfo);
  }
  return { ...fixtureUserInfo };
};

const updateUserInfo = (userInfo: UserInfo) => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

export const updateUserNickName = (nickname: string) => {
  const userInfo = getUserInfo();
  userInfo.nickname = nickname;
  updateUserInfo(userInfo);
};

export const addUserGame = (gameID: string) => {
  const userInfo = getUserInfo();
  userInfo.games.push({ gameID });
  updateUserInfo(userInfo);
};
