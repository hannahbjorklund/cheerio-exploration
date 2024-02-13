const express = require('express');
const router = express.Router();
const axios = require('axios');
const puppeteer = require('puppeteer');


router.get('/', (req, res) => {
    console.log("Test")
    // Fanfiction.net is protected by anti-bot software. As a result, we can't use axios to
    //  scrape the html. This is where we can use puppeteer
    
    puppeteer.launch()
        .then(async function(browser){
            const page = await browser.newPage();
            await page.goto('https://m.fanfiction.net/s/13825360/0/');
            setTimeout(() => {
                console.log("In timeout")
            }, 10000)
            await page.screenshot({path: 'ffdotnet.png'})
            await browser.close()
        })


        res.sendStatus(200)
})


module.exports = router;