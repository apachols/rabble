import React, { useContext } from "react";

import { ThemeSelectorContext } from "./Theme";

const ThemeSelector = () => {
  const { themeName, toggleTheme } = useContext(ThemeSelectorContext);

  return <button onClick={toggleTheme}>Theme: {themeName}</button>;
};

export default ThemeSelector;