const express = require("express");
const router = express.Router();
const puppeteerExtra = require("puppeteer-extra");
const cheerio = require('cheerio');
const Stealth = require("puppeteer-extra-plugin-stealth");

puppeteerExtra.use(Stealth());

router.get("/", (req, res) => {

  const chapters = [];

  // Fanfiction.net is protected by anti-bot software. As a result, we can't use axios to
  //  scrape the html. This is where we can use puppeteer
  puppeteerExtra.launch({headless: true, devtools: true, targetFilter: (target) => !!target.url}).then(async function (browser) {
    const page = await browser.newPage();
    // Puppeteer will navigate to the story page
    await page.goto("https://www.wattpad.com/story/216190804-leon-kennedy-x-reader");
    await page.waitForSelector('.btn-primary.read-btn');
    // Clicking on the Read button
    await page.click('.btn-primary.read-btn');
    // Navigating to the start of the work
    await page.waitForNavigation();
    await page.screenshot({ path: "ffdotnet.png" });
    const html = await page.content();
    const $ = cheerio.load(html);
    

    res.send(html);
    await browser.close();
  });
});

module.exports = router;
