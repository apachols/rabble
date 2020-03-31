import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./webapp/App";
import { store } from "./webapp/app/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
