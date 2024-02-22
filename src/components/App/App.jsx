import React, { useState, useRef } from "react";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import axios from "axios";
import AppBar from "../AppBar/AppBar";

import "./App.css";

function App() {
  const [inputURL, setInputURL] = useState("");
  const [ficData, setFicData] = useState("");
  const headerRef = useRef(null);

  /**
   * Handles form submission when user clicks submit button. Will strip the fic ID from the given url and
   *  make an axios request for the fic info
   * @param {*} e event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Trim the id from the provided url, the id will be between works/id/chapters if the work has multiple chapters,
    //  or after works/ if it is a single chapter work
    let ficID;
    if (inputURL.includes("/chapters")) {
      ficID = inputURL.substring(
        inputURL.indexOf("works/") + 6,
        inputURL.indexOf("/chapters")
      );
    } else {
      ficID = inputURL.substring(inputURL.indexOf("works") + 6);
    }

    // Send a request to the server
    axios({
      method: "GET",
      url: `/api/ao3/work/${ficID}`,
    }).then((result) => {
      setFicData(result.data);
      console.log(result.data);
    });
    setInputURL("");
  };

  /**
   * When the user clicks the clear button, will clear the form input field
   * @param {*} e event
   */
  const handleClear = (e) => {
    e.preventDefault();
    setInputURL("");
  };

  return (
    <div className="container">
      <div className="site-header" ref={headerRef}>
        <h1>Import an AO3 work:</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>URL: </label>
            <input
              required
              placeholder="AO3 url"
              value={inputURL}
              onChange={(e) => setInputURL(e.target.value)}
            />
          </div>
          <div className="button-group">
            <Button size="medium" type="submit" variant="contained">
              Submit
            </Button>
            <Button
              sx={{ marginLeft: "0.5em" }}
              variant="outlined"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </form>
      </div>
      <hr />
      <div className="pre-text">
        <div className="title-group">
          <h1 className="title">{ficData.title || ""}</h1>
          {ficData.author && <h2>by {ficData.author}</h2>}
        </div>
        {ficData.stats && (
          <Accordion
            sx={{
              fontFamily: "Open Sans",
              backgroundColor: "#303030",
              color: "antiquewhite",
              fontSize: "19px",
              width: "95%",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore style={{ color: "antiquewhite" }} />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Work Stats
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: "#343434",
                fontFamily: "Open Sans",
                fontSize: "16px",
              }}
            >
              <div className="stats-container">
                <div>
                  <p>Words: {ficData.stats.words}</p>
                  <p>Chapters: {ficData.stats.chapters}</p>
                  <p>Published: {ficData.stats.published}</p>
                  <p>Completed: {ficData.stats.completed}</p>
                </div>
                <div>
                  <p>Hits: {ficData.stats.hits}</p>
                  <p>Kudos: {ficData.stats.kudos}</p>
                  <p>Comments: {ficData.stats.comments}</p>
                  <p>Bookmarks: {ficData.stats.bookmarks}</p>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        )}
      </div>
      <br />
      {ficData && <hr />}
      <div className="text-body">
        {ficData &&
          ficData.chapters.map((x, i) => {
            return (
              <>
                <h2 id={i+1} className={`chap-${i+1}-header`}>
                  {x.chapter_title}
                </h2>
                {x.chapter_text.map((y, j) => {
                  return (
                    <p id={j+1} className="chap-line">
                      {y}
                    </p>
                  );
                })}
              </>
            );
          })}
          <AppBar chapters={ficData.chapters} headerRef={headerRef}/>
      </div>
    </div>
  );
}

export default App;
