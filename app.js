const puppet = require('puppeteer');


const scraper = async () => {
    const browser = await puppet.launch({headless:false,defaultViewport:null});

    const tab1 = await browser.newPage();

    await tab1.goto("https://www.imdb.com/title/tt7059844/fullcredits");

    await tab1.waitFor(".cast_list");

    const result = await tab1.evaluate(() => {
        const rows = document.querySelectorAll(
          'table[class="cast_list"]>tbody>tr'
        );
        elementArray = Array.from(rows);

        return elementArray.map(row => {
            let char = document.querySelector('.character').innerText
            return char
        })
    })
    
    console.log(result);

    browser.close()
}

scraper()