import { mount } from "enzyme";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import SaveIndicator from "./components/ListView/SaveIndicator";

it("renders without crashing", () => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => [] }));
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("saves pokemon when heart is clicked", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => [{ name: "pikachu", image: "" }] })
  );
  jest.spyOn(Storage.prototype, 'setItem');
  const app = mount(<App />);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  app.update();
  const indicator = app.find(SaveIndicator);
  indicator.prop("onToggle")("pikachu");
  expect(localStorage.setItem).toHaveBeenCalledWith(
    "saved_pokemon",
    JSON.stringify({ pikachu: true })
  );
});
