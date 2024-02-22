const express = require("express");
const router = express.Router();
const puppeteerExtra = require("puppeteer-extra");
const Stealth = require("puppeteer-extra-plugin-stealth");

puppeteerExtra.use(Stealth());

router.get("/", (req, res) => {
  // Fanfiction.net is protected by anti-bot software. As a result, we can't use axios to
  //  scrape the html. This is where we can use puppeteer
  puppeteerExtra.launch({headless: true, devtools: true, targetFilter: (target) => !!target.url}).then(async function (browser) {
    const page = await browser.newPage();
    // Create a user agent mimicking that of a real browser to help bypass anti-bot mechanisms
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    // Puppeteer will navigate to the 
    await page.goto("https://www.wattpad.com/story/216190804-leon-kennedy-x-reader");
    await page.waitForSelector('.btn-primary.read-btn');
    await page.click('.btn-primary.read-btn');
    await page.waitForNavigation();
    await page.screenshot({ path: "ffdotnet.png" });
    const html = await page.content();
    res.send(html);
    await browser.close();
  });
});

module.exports = router;
