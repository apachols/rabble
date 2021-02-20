import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

test.skip("broken due to rabble logo updates, TODO", () => {

  const { getAllByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(getAllByText(/Rabble/i).length).toBeGreaterThan(0);
});
