import React, { useState, useEffect } from "react";
import "./styles.css";
import { fakeFetch, FetchResponse } from './fake-fetch'

/**
 * 👉 👉 NEVER MAKE A FORM THIS WAY 👈 👈
 * 👏 👏 Use a form library please 👏 👏
 */
export function Form() {
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

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (textValue.trim() === "#invalid") {
      setTextError("text is invalid");
    } else {
      setTextError("")
    }
    if (Date.parse(dateValue) < Date.now()) {
      setDateError("date is invalid");
    } else {
      setDateError("")
    }
    if (Date.parse(dateValue) >= Date.now() && textValue.trim() !== "#invalid") {
      setSubmitSuccess(true);
    }
  };

  if (submitSuccess) {
    return <h1>Form was submitted successfully!</h1>;
  } else {
    return (
      <div className="Form">
        <h1>Fake form</h1>
        <p>
          Hint: to fail the form validation, either enter a date before today or
          type "#textfail" in the textbox
        </p>
        <div className="form-container">
          <form>
            <label>
              Enter a date:
              <input
                type="date"
                value={dateValue}
                className={dateError && "error"}
                onChange={(e) => setDateValue(e.target.value)}
              />
              <p className="error">{dateError}</p>
            </label>
            <label>
              Enter good text
              <input
                type="text"
                value={textValue}
                className={textError && "error"}
                onChange={(e) => setTextValue(e.target.value)}
              />
              <p className="error">{textError}</p>
            </label>
            <button type="submit" onClick={onSubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}
