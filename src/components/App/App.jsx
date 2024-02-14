import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import axios from 'axios';

import './App.css';

function App() {
  const [inputURL, setInputURL] = useState('');
  const [ficData, setFicData] = useState('');

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
    if(inputURL.includes("/chapters")){
      ficID = inputURL.substring(inputURL.indexOf('works/') + 6, inputURL.indexOf('/chapters'));
    } else {
      ficID = inputURL.substring(inputURL.indexOf('works') + 6);
    }
    
    // Send a request to the server
    axios({
      method: 'GET',
      url: `/api/ao3/work/${ficID}`
    }).then((result) => {
        setFicData(result.data);
        console.log(ficData);
    })
    setInputURL('');
  }

  /**
   * When the user clicks the clear button, will clear the form input field
   * @param {*} e event
   */
  const handleClear = (e) => {
    e.preventDefault();
    setInputURL('');
  }

  return (
    <div className = 'container'>
      <h1>Import an AO3 work:</h1>
      <form onSubmit={handleSubmit}>
        <label>URL: </label>
        <input
          placeholder='AO3 url'
          value={inputURL}
          onChange = {(e) => setInputURL(e.target.value)}
        />
        <Button type='submit' variant='contained'>Submit</Button>
        <Button sx={{marginLeft: '0.5em'}} variant='outlined' onClick={handleClear}>Clear</Button>
      </form>
      <div className = 'pre-text'>
        <h1>{ficData.title || ""}</h1>
        {ficData.author && <h2>by {ficData.author}</h2>}
        {//ficData.stats && 
          <Accordion sx={{fontFamily: 'Open Sans',
          backgroundColor: '#303030',
          color: 'antiquewhite',
          fontSize: '18px'}}>
            <AccordionSummary
              expandIcon={<ExpandMore style={{color: 'antiquewhite'}}/>}
              aria-controls='panel1-content'
              id='panel1-header'
            >
              Work Stats
            </AccordionSummary>
            <AccordionDetails sx={{backgroundColor: '#343434'}}>
              Test
            </AccordionDetails>
          </Accordion>
        }
      </div>
      <div className = 'text-body'>
        {ficData && ficData.chapters.map((x, i) => {
          return (
            <h3 id={i} className = 'chap-header'>
              {x.chapter_title}
              <hr/>
              {
                x.chapter_text.map((y, j) => {
                  return <p id={j} className = 'chap-line'>{y}</p>
                })
              }
            </h3>
          )
        })}
      </div>
    </div>
  );
}

export default App;
