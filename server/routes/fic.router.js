const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Get the fic data for a fic by ID
 */
router.get('/:id', (req, res) => {
  console.log("In get route")
  const id = req.params.id;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/works/${id}?view_adult=true&view_full_work=true`
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
    const series = $('.position a:first').text().trim();
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
    $('#workskin .preface.group:first').find('.summary.module p').each((i , el) => {
      summary.push($(el).text().trim());
    })
    const notes = [];
    $('#workskin .preface.group:first').find('.notes.module p').each((i, el) => {
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
    
    // For each chapter div
    $('div#chapters').children().each((i, el) => {
      // Each chapter div has 2 unique children, preface group and userstuff
      // Create a chapter object
      const chapter = {
        chapter_title: '',
        chapter_summary: [],
        chapter_notes_start: [],
        chapter_notes_end: [],
        chapter_text: []
      }

      $(el).children().each((j, chil) => {
        // In the first preface group, scrape chapter title, summary, and notes
        if (j==0){
          chapter.chapter_title = $(chil).find('.title').text().trim();

          $(chil).find('.summary.module blockquote p').each((k, line) => {
            chapter.chapter_summary.push($(line).text().trim());
          })

          $(chil).find('.notes.module blockquote p').each((k, line) => {
            chapter.chapter_notes_start.push($(line).text().trim());
          })
          
          // In the chapter body, scrape paragraphs
        } else if(j == 1){
          $(chil).find('p').each((k, line) => {
            chapter.chapter_text.push($(line).text().trim());
          });
          
          // If there are more than two children, then there is an end of chapter notes section we need to grab
        } else {
          $(chil).find('.end.notes.module blockquote p').each((k, line) => {
            chapter.chapter_notes_end.push($(line).text().trim());
          });
        }
      })
      fic.chapters.push(chapter);
    })

    // Retrieved all fic data and formatted object. Time to send!
    res.send(fic);

  }).catch((error) => {
    console.log("Error in GET /fic/id :", error);
    res.sendStatus(500);
  })
});


module.exports = router;
