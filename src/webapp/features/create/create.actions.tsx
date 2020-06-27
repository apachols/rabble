import axios from "axios";
import { createUserGame } from "../../app/asyncStorage";

const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;

interface History {
  push(url: string): void
};

export const postToCreateGame = async (history:History) => {
  console.log('posting to create:');
  // const res = await axios({
  //   method: "post",
  //   headers: {
  //     "content-type": "application/json",
  //   },
  //   url: `${API_ROOT}/games/rabble/create`,
  //   data: {
  //     setupData: {},
  //     numPlayers: 2,
  //   },
  // });
  // debuggin
  const res = { data: { gameID: '5'}};

  const { gameID } = res.data;
  console.log('got result:', gameID);

  if (gameID) {
    await createUserGame(gameID);
  } else {
    throw new Error("Game ID not returned from server");
  }
  console.log(`@TODO you hardcoded your ip! REACT_APP_API_ROOT: ${process.env?.REACT_APP_API_ROOT}`)
  console.log("got a gameID:", gameID);
 
  // @TODO do this in webapp version
  // return <Redirect to={`/join/${gameID}`}/>;
  history.push(`/join/${gameID}`);
};
