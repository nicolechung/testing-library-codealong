import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Form } from "./form";
import * as Fetch from "./fake-fetch";

jest.mock("./fake-fetch");

// todo: mocks
// fakeThirdPartyLibrary
// localStorage
// "fake" fetch
// date

let getItemSpy;
let fakeFetch = jest.spyOn(Fetch, "fakeFetch");

const arrange = async ({ responseMock }) => {
  fakeFetch.mockImplementation(() => Promise.resolve(responseMock));
  await act(async () => {
    render(<Form />);
  });
  expect(fakeFetch).toHaveBeenCalledTimes(1);
  expect(getItemSpy).toHaveBeenCalled();
};

describe("Form", () => {
  beforeEach(() => {
    global.fakeThirdPartyJSLibrary = "💪 hello world!! 💪";
    getItemSpy = jest
      .spyOn(window, "localStorage", "get")
      .mockReturnValue("💩💩💩");

    const dateNowStub = jest.fn(() => new Date("2020-04-30").valueOf());
    global.Date.now = dateNowStub;
  });

  afterEach(() => {
    // reset getItemSpy and fakeFetch
    jest.resetAllMocks();
  });

  afterAll(() => {
    delete global.fakeThirdPartyJSLibrary;
    const realDateNow = Date.now.bind(global.Date);
    global.Date.now = realDateNow;
  });

  it("should render, fetch data from the api, localstorage and globals and display the data", async () => {
    const responseMock = {
      date: "2020-02-01",
      text: "#invalid",
    };
    await arrange({ responseMock });
    expect(
      screen.getByRole("heading", {
        name: /💪 hello world!! 💪/i,
      }).textContent
    ).toEqual("💪 hello world!! 💪");

    expect(
      screen.getByRole("heading", {
        name: /💩💩💩/i,
      }).textContent
    ).toEqual("💩💩💩");
    if (!(screen.getByLabelText(/enter a date:/i) as HTMLInputElement)) {
      throw new Error("date input is not an HTMLInputElement");
    }
    expect(
      (screen.getByLabelText(/enter a date:/i) as HTMLInputElement).value
    ).toEqual("2020-02-01");

    if (
      !(screen.getByRole("textbox", {
        name: /enter good text/i,
      }) as HTMLInputElement)
    ) {
      throw new Error("text input is not an HTMLInputElement");
    }
    expect(
      (screen.getByRole("textbox", {
        name: /enter good text/i,
      }) as HTMLInputElement).value
    ).toEqual("#invalid");
  });

  it("should display errors with invalid data and prevent form submi", async () => {
    const responseMock = {
      date: "2020-02-01",
      text: "#invalid",
    };
    await arrange({ responseMock });
    // click the form submit
    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /submit/i,
        })
      );
    });
    // check to see if the errors exist
    expect(screen.getByText(/date is invalid/i)).toBeVisible();
    expect(screen.getByText(/text is invalid/i)).toBeVisible();
  });

  it("should display a success message with valid data on form submit", async () => {
    const responseMock = {
      date: "2020-02-01",
      text: "#invalid",
    };
    await arrange({ responseMock });
    // enter correct data
    fireEvent.change(screen.getByLabelText(/enter a date:/i), {
      target: { value: "2020-05-11" },
    });

    fireEvent.change(
      screen.getByRole("textbox", {
        name: /enter good text/i,
      }),
      {
        target: { value: "Something good" },
      }
    );
    // click the form submit
    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /submit/i,
        })
      );
    });

    // check to see if the errors are NOT present
    expect(screen.queryByText(/date is invalid/i)).toBeNull();
    expect(screen.queryByText(/text is invalid/i)).toBeNull();

    // check for success message
    expect(
      screen.getByRole("heading", {
        name: /form was submitted successfully!/i,
      })
    ).toBeVisible();
  });
});
