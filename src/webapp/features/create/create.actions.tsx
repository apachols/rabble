import axios from "axios";
import { createUserGame } from "../../app/asyncStorage";

const API_ROOT = `${process.env.REACT_APP_API_ROOT || ""}`;

export const postToCreateGame = async (history:any) => {
  const res = await axios({
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    url: `${API_ROOT}/games/rabble/create`,
    data: {
      setupData: {},
      numPlayers: 2,
    },
  });

  const { gameID } = res.data;

  if (gameID) {
    await createUserGame(gameID);
  } else {
    throw new Error("Game ID not returned from server");
  }
 
  history.push(`/join/${gameID}`);
};
