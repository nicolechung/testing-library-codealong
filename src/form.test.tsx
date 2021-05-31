import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Form } from "./form";
import * as Fetch from "./fake-fetch";

// todo - mocks
// fakeThirdPartyLibrary
// localStorage
// fetch
// date

const arrange = async () => {
  await act(async () => {
    render(<Form />);
  });
};

describe("Form", () => {
  it("should render, fetch data from the api, localstorage and globals and display the data", async () => {
    await arrange();
  });

  it("should display errors with invalid data and prevent form submit", async () => {
    await arrange();
  });

  it("should display a success message with valid data on form submit", async () => {
    await arrange();
  });
});
