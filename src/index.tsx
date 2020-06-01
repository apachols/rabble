import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./webapp/App";
import { store } from "./webapp/app/store";
import { Provider } from "react-redux";
import axios from "axios";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

const API_ROOT = `${process.env?.REACT_APP_API_ROOT || ""}`;
window.addEventListener("error", function (event) {
  if (event.error.hasBeenCaught !== undefined) {
    return false;
  }
  event.error.hasBeenCaught = true;
  const { message } = event.error;
  axios({
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    url: `${API_ROOT}/client-logs`,
    data: { message },
  });
});
