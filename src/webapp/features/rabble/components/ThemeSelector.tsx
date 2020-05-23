import React, { useContext } from "react";

import { ThemeSelectorContext } from "./Theme";

export default () => {
  const { themeName, toggleTheme } = useContext(ThemeSelectorContext);

  return (
    <>
      <div>My theme is {themeName}</div>
      <button onClick={toggleTheme}>Change Theme!</button>
    </>
  );
};
