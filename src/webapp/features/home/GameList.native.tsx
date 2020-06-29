import React from "react";
import RecentGame from "./RecentGame.native";
import { View } from "react-native";

type GameListProps = {
  games: UserGameInfo[];
};

const TurnList = (props: GameListProps) => {
  const { games } = props;
  return (<View>
    {games
      .sort((a, b) => b.createdAt > a.createdAt ? 1 : -1)
      .map((g) => {
      return <RecentGame key={g.gameID} game={g} />;
    })
    }
  </View>
  );
};

export default TurnList;
