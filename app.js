const puppet = require("puppeteer");

const scraper = async () => {
  const browser = await puppet.launch({
    headless: false,
    defaultViewport: null,
  });
  const tab1 = await browser.newPage();
  await tab1.goto("https://www.imdb.com/title/tt7059844/fullcredits");
  await tab1.waitFor(".cast_list");

  let nameData = await tab1.evaluate(() => {
    const names = [];
    let rows = Array.from(
      document.querySelectorAll("table[class='cast_list']>tbody>tr")
    );
    rows.forEach((ele) => {
      let nameJson = {};
      try {
        nameJson.name = ele.querySelector("td:nth-child(2)").innerText;
        nameJson.character = ele.querySelector("td:nth-child(4)").innerText;
      } catch (exception) {}
      if (nameJson.name !== null) {
        names.push(nameJson);
      }
    });
    return names;
  });

  console.table(nameData);
  console.log(nameData.length);
  browser.close();
};

scraper();
