import React from "react";
import Engine from "./engine";

const TicTacToe = () => {
  // const count = useSelector(selectCount);
  // const dispatch = useDispatch();
  // const [test] = useState("2");
  // setTest("3");

  const url = new URL(window.location.href);
  const pid = url.searchParams.get("pid") || "0";

  return (
    <div>
      <div>Tic Tac Toe</div>
      <div>
        <Engine playerID={pid} gameID={"ug68pvfvM"} />
      </div>
    </div>
  );
};

export default TicTacToe;
