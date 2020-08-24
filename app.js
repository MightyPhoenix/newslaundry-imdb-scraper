const puppet = require("puppeteer");
const csv = require("csv-parser");
const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");
const results = [];
let finalData = [];

const scraper = async ({ tconst, title, year }) => {
  // Launch Puppet Browser
  const browser = await puppet.launch({
    headless: true,
    defaultViewport: null,
  });
  // Open New Tab
  const tab1 = await browser.newPage();
  console.log(`Opening ${tconst}-->${title}...`);
  // Open Link
  await tab1.goto(`https://www.imdb.com/title/${tconst}/fullcredits`);
  await tab1.waitFor(".cast_list");
  // Start Evaluationg (Scraping)
  console.log("Scraping Started!");
  let nameData = await tab1.evaluate(() => {
    const castList = [];
    let rows = document.querySelectorAll("table[class='cast_list']>tbody>tr");
    rows.forEach((ele) => {
      let cast = {};
      try {
        cast.name = ele.querySelector("td:nth-child(2)").innerText;
        cast.character = ele.querySelector("td:nth-child(4)").innerText;
      } catch (exception) {}
      if (cast.name) {
        castList.push(cast);
      }
    });
    return castList;
  });
  // Data Formatting {tconst,title,year,actor,character}
  let cleanUp = nameData.map((i) => {
    return { tconst: tconst, title: title, year: year, ...i };
  });
  //Close Browser
  browser.close();
  console.log(`Scraping Done!`);
  return cleanUp;
};

fs.createReadStream("input.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    for (let i = 0; i < results.length; i++) {
      console.log(`${i + 1}/${results.length}`);
      charData = await scraper({
        tconst: results[i].tconst,
        title: results[i].title,
        year: results[i].year,
      });
      try {
        finalData = await [...finalData, ...charData];
        // console.table(finalData);
      } catch (exception) {
        console.log(exception);
      }
    }
    // console.table(finalData);
    (async () => {
      const csv = new ObjectsToCsv(finalData);
      // Save to file:
      await csv.toDisk("./output.csv");
    })();
  });
