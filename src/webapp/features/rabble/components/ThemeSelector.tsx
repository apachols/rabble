import React, { useContext } from "react";

import { ThemeSelectorContext } from "./Theme";

export default () => {
  const { themeName, toggleTheme } = useContext(ThemeSelectorContext);

  return <button onClick={toggleTheme}>Theme: {themeName}</button>;
};
