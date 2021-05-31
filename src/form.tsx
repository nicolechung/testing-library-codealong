import React, { useEffect, useState } from "react";
import "regenerator-runtime/runtime";
import { fakeFetch, FetchResponse } from "./fake-fetch";
import "./styles.css";

/**
 * 👉 👉 NEVER MAKE A FORM THIS WAY 👈 👈
 * 👏 👏 Use a form library please 👏 👏
 */
export const Form = () => {
  const [textValue, setTextValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [textError, setTextError] = useState("");
  const [dateError, setDateError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result: FetchResponse = await fakeFetch();
      setDateValue(result.date);
      setTextValue(result.text);
    }
    fetchData();
  }, []);

  const storage = window.localStorage;

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (textValue.trim() === "#invalid") {
      setTextError("text is invalid");
    } else {
      setTextError("");
    }
    if (Date.parse(dateValue) < Date.now()) {
      setDateError("date is invalid");
    } else {
      setDateError("");
    }
    if (
      Date.parse(dateValue) >= Date.now() &&
      textValue.trim() !== "#invalid"
    ) {
      setSubmitSuccess(true);
    }
  };
  if (submitSuccess) {
    return (
      <div className="Form">
        <h1>Form was submitted successfully!</h1>
      </div>
    );
  } else {
    return (
      <div className="Form">
        <h1>Fake form</h1>
        <p>
          Hint: to fail the form validation, either enter a date before{" "}
          <strong>today</strong> or type <strong>"#invalid"</strong> in the
          textbox
        </p>
        <h2>{(window as any).fakeThirdPartyJSLibrary}</h2>
        <h3>{storage.getItem("yo")}</h3>
        <div className="form-container">
          <form>
            <label htmlFor="enterdate">Enter a date:</label>
            <input
              type="date"
              id="enterdate"
              value={dateValue}
              className={dateError && "error"}
              onChange={(e) => setDateValue(e.target.value)}
            />
            <p className="error">{dateError}</p>

            <label htmlFor="entertext">Enter good text</label>
            <input
              type="text"
              id="entertext"
              value={textValue}
              className={textError && "error"}
              onChange={(e) => setTextValue(e.target.value)}
            />
            <p className="error">{textError}</p>

            <button type="submit" onClick={onSubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
};
