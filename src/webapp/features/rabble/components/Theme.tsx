import React, { useState, useEffect } from "react";

const themes = {
  dark: {
    bg: "#2e353d",
    "square-border": "rgba(188, 184, 174, 0.621)",
    "text-primary": "rgb(214, 209, 200)",
    "table-color": "#DEBD91",
    "table-bg": "rgba(173, 121, 53, 0.073)",
  },
  light: {
    bg: "floralwhite",
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
    "text-primary": "black",
    "table-color": "#3b3938",
    "table-bg": "rgba(173, 160, 156, 0.382)",
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

const Theme = (props: ThemeSelectorContextProps) => {
  const [themeName, setThemeName] = useState("light");
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

export default Theme;
