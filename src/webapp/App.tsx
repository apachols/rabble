import React  from "react";
import "./App.css";

import Navbar from "./features/navbar/navbar";

import Theme from "./features/rabble/components/Theme";
import RabbleLogo from "./features/rabble_logo/rabbleLogo";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { BrowserRouter as Router } from "react-router-dom";

import AuthProvider from "./AuthProvider";
import Routes from "./Routes";

const isTouch = navigator.maxTouchPoints || navigator.msMaxTouchPoints;

const dndDesktopProps = {
  backend: HTML5Backend,
};

const dndTouchProps = {
  backend: TouchBackend,
  options: { enableHoverOutsideTarget: true, enableMouseEvents: true },
};

export default function App() {
  return (
    <Theme>
      <DndProvider {...(isTouch ? dndTouchProps : dndDesktopProps)}>
        <Router>
          <div className="App">
            <RabbleLogo />
            <Navbar />
            <AuthProvider >
              <Routes/>
            </AuthProvider>
          </div>
        </Router>
      </DndProvider>
    </Theme>
  );
}
