import React from 'react';
import { mount } from "enzyme";
import SaveIndicator from "./index";

describe("SaveIndicator", () => {
  it("should trigger onToggle callback when icon is clicked", () => {
    const callback = jest.fn();
    const comp = mount(
      <SaveIndicator onToggle={callback} name="test" value={true} />
    );
    const icon = comp.find("svg");
    icon.prop("onClick")();
    expect(callback).toHaveBeenCalledWith("test");
  });
});
