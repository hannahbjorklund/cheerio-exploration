const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Get the fic data for a fic by ID
 */
router.get('/:id', (req, res) => {
  const id = req.params.id;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/works/${id}?view_full_work=true`
  }).then((response) => {

    // Scraping using cheerio
    const $ = cheerio.load(response.data);
    
    // Grabbing the fic title
    // using .trim will get rid of newline characters in the text
    const title = $('.title.heading').text().trim();
    
    // Grabbing other info
    const author = $('.byline.heading').text().trim();
    const rating = $('.rating.tags ul').text().trim();
    const language = $('dd.language').text().trim();
    const series = $('.series span:first').text().trim();
    const warnings = [];
    $('.warning.tags li').each((i, el) => {
      warnings.push($(el).text().trim());
    })
    const categories = [];
    $('.category.tags li').each((i, el) => {
      categories.push($(el).text().trim());
    })
    const fandoms = [];
    $('.fandom.tags li').each((i, el) => {
      fandoms.push($(el).text().trim());
    })
    const relationships = [];
    $('.relationship.tags li').each((i, el) => {
      relationships.push($(el).text().trim());
    })
    const characters = [];
    $('.character.tags li').each((i, el) => {
      characters.push($(el).text().trim());
    })
    const tags = [];
    $('.freeform.tags li').each((i, el) => {
      tags.push($(el).text().trim());
    })
    const stats = {};
    $('.stats dt').each((i, el) => {
      stats[($(el).text().trim().slice(0, -1))] = $(el).next().text().trim();
    })
    const summary = [];
    $('.summary.module:first p').each((i , el) => {
      summary.push($(el).text().trim());
    })
    const notes = [];
    $('.notes.module:first p').each((i, el) => {
      notes.push($(el).text().trim());
    })

    // Creating a fic object
    const fic = {
      title, 
      author, 
      rating,
      warnings,
      categories,
      fandoms,
      relationships, 
      characters,
      tags,
      language,
      series,
      stats,
      summary,
      notes, 
      chapters: []
    };
    
    // For each chapter, 
    $('div.chapter.preface.group').each((i, el) => {
      // Scrape the chapter title
      const chapter_title = $(el).find('.title').text().trim();

      // Fics on AO3 can also have a notes and summary for each chapter
      const chapter_notes_start = [];
      $(el).find('.notes.module:first blockquote').each((j, elem) => {
        chapter_notes_start.push($(elem).text().trim());
      })
      const chapter_notes_end = [];
      $(el).find('.end.notes.module:first blockquote').each((j, elem) => {
        chapter_notes_end.push($(elem).text().trim());
      })
      const chapter_summary = [];
      $(el).find('.summary.module:first blockquote').each((j, elem) => {
        chapter_summary.push($(elem).text().trim());
      })
      
      // Create a new object for each chapter, with two properties
      fic.chapters.push({chapter_title, chapter_notes_start, chapter_notes_end, chapter_summary, chapter_text: []});

      // Scrape the chapter lines
      $(el).next().find('p').each((j, elem) => {
        fic.chapters[i].chapter_text.push($(elem).text().trim());
      });
    });

    // Retrieved all fic data and formatted object. Time to send!
    res.send(fic);

  }).catch((error) => {
    console.log("Error in GET /fic/id :", error);
    res.sendStatus(500);
  })
});


module.exports = router;
