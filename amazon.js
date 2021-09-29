const puppeteer = require('puppeteer');

var json = [];

const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
];

const options = {
    args,
    headless: true,
    ignoreHTTPSErrors: true,
    userDataDir: './tmp'
};

async function scrape(keyword) {

    keyword = keyword.replace(/ /g, '+');

    var url = 'https://www.amazon.com/s?k=' + keyword +'+&ref=nb_sb_noss_1';
    //Launch Browser    
    const browser = await puppeteer.launch(options);
    var start = new Date().getTime();
    //New page Browser    
    const page = await browser.newPage();
    await page.goto(url);
    
    for(var i = 2; i < 4; i++) {
        try {

            var imgXpath = '//*[@id="search"]/div[1]/div[1]/div/span[3]/div[2]/div[' + i + ']/div/span/div/div/div[2]/div[1]/div/div/span/a/div/img';
            var titleXpath = '//*[@id="search"]/div[1]/div[1]/div/span[3]/div[2]/div[' + i + ']/div/span/div/div/div[2]/div[2]/div/div/div[1]/h2/a/span';
            var priceXpath = '//*[@id="search"]/div[1]/div[1]/div/span[3]/div[2]/div[' + i + ']/div/span/div/div/div[2]/div[2]/div/div/div[3]/div[1]/div/div[1]/div[1]/a/span[1]/span[2]';
            var linkXpath = '//*[@id="search"]/div[1]/div[1]/div/span[3]/div[2]/div[' + i + ']/div/span/div/div/div[2]/div[1]/div/div/span/a';
    
            var [imgEl] = await page.$x(imgXpath);
            var [titleEl] = await page.$x(titleXpath);
            var [priceEl] = await page.$x(priceXpath);
            var [linkEl] = await page.$x(linkXpath);

            var imgTemp = await imgEl.getProperty('src');
            var img = await imgTemp.jsonValue();

            var titleTemp = await titleEl.getProperty('textContent');
            var title = await titleTemp.jsonValue();

            var priceTemp = await priceEl.getProperty('textContent');
            var price = await priceTemp.jsonValue();
            
            var linkTemp = await linkEl.getProperty('href');
            var link = await linkTemp.jsonValue();
            
            var data = {
                image: img,
                title: title,
                price: price,
                link: link,
                source: 'amazon'
            }

            json.push(data);
        } catch(error) {
            continue
        }
    }
    await browser.close();
    //console.log(json)
    var end = new Date().getTime();
    var time = end - start;
    console.log("amanzon.js = " + time)
    return json;
}

module.exports = { scrape };



//*[@id="search"]/div[1]/div[1]/div/span[3]/div[2]/div[1]
//*[@id="search"]/div[1]/div[1]/div/span[3]/div[2]/div[2]
