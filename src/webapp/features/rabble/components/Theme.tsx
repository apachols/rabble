import React, { useState, useEffect } from "react";

const themes = {
  dark: {
    bg: "#3d3d29",
  },
  light: {
    bg: "#FFE08122",
    selection: "#FF957F",
    "selection-light": "#FF957F44",
    "selection-lighter": "#FF957F22",
    "square-empty": "#C9C6C166",
    "square-dl": "#6F6CAF",
    "square-tl": "#474671",
    "square-dw": "#DA799D",
    "square-tw": "#8D4E65",
    "square-border": "#FFFFFF",
    "selected-darkfont": "#444",
  },
};

export const ThemeSelectorContext = React.createContext({
  themeName: "light",
  toggleTheme: () => {
    console.log("default stuff");
  },
});

type ThemeSelectorContextProps = {
  children: any;
};

type ThemeObject = { [index: string]: string };

const setCSSVariables = (theme: ThemeObject) => {
  for (const value in theme) {
    document.documentElement.style.setProperty(`--${value}`, theme[value]);
  }
};

export default (props: ThemeSelectorContextProps) => {
  const [themeName, setThemeName] = useState("light");
  console.log("toggleTheme being defined");
  const toggleTheme = () => {
    themeName === "dark" ? setThemeName("light") : setThemeName("dark");
  };

  useEffect(() => {
    setCSSVariables(themeName === "dark" ? themes.dark : themes.light);
  });

  return (
    <ThemeSelectorContext.Provider value={{ themeName, toggleTheme }}>
      {props.children}
    </ThemeSelectorContext.Provider>
  );
};
