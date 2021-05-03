import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Form } from "./form";
import * as Fetch from "./fake-fetch";

// adding something new and temporary to the global object for this test
declare global {
  var special: string;
}

// spyOn globals that already exist on the window
let getItemSpy;

jest.mock("./fake-fetch");

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
    jest.useFakeTimers();
    getItemSpy = jest
      .spyOn(global.Storage.prototype, "getItem")
      .mockReturnValue("Hello");

    global.special = "POOP";

    const dateNowStub = jest.fn(() => new Date("2020-04-30").valueOf());
    global.Date.now = dateNowStub;
  });

  afterEach(() => {
    getItemSpy.mockRestore();
    fakeFetch.mockRestore();
  });

  afterAll(() => {
    const realDateNow = Date.now.bind(global.Date);
    global.Date.now = realDateNow
  })

  it("renders, fetches data from the api, localstorage and globals and displays the data", async () => {
    const responseMock = {
      date: "2020-04-20",
      text: "HALLO",
    };
    await arrange({ responseMock });

    await screen.getByRole("heading", {
      name: /Hello/i,
    });

    await screen.getByRole("heading", {
      name: /POOP/i,
    });

    expect(
      (screen.getByLabelText(/enter a date:/i) as HTMLInputElement).value
    ).toEqual(responseMock.date);
    expect(
      (screen.getByRole("textbox", {
        name: /enter good text/i,
      }) as HTMLInputElement).value
    ).toEqual(responseMock.text);
  });

  it("displays an error with invalid data", async () => {
    const responseMock = {
      date: "2020-04-20",
      text: "#invalid",
    };
    await arrange({ responseMock });
    fireEvent.change(screen.getByLabelText(/enter a date:/i), {
      target: { value: "2020-01-01" },
    });
    fireEvent.change(
      screen.getByRole("textbox", {
        name: /enter good text/i,
      }),
      { target: { value: "#invalid" } }
    );

    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /submit/i,
        })
      );
    });
    expect(screen.getByText(/date is invalid/i)).toBeVisible();
    expect(screen.getByText(/text is invalid/i)).toBeVisible();
  });

  it("displays a success message with valid data on form submit", async () => {
    const responseMock = {
      date: "2020-04-20",
      text: "#invalid",
    };
    await arrange({ responseMock });
    fireEvent.change(screen.getByLabelText(/enter a date:/i), {
      target: { value: "2020-05-10" },
    });
    fireEvent.change(
      screen.getByRole("textbox", {
        name: /enter good text/i,
      }),
      { target: { value: "Hello! This is good text" } }
    );

    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /submit/i,
        })
      );
    });
    expect(screen.queryByText(/date is invalid/i)).toBe(null);
    expect(screen.queryByText(/text is invalid/i)).toBe(null);
    expect(
      screen.getByRole("heading", {
        name: /form was submitted successfully!/i,
      })
    ).toBeVisible();
  });
});
