const puppeteer = require('puppeteer');

var json = []

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
    var keyword = keyword.replace(/ /g, '%20') 

    var url = 'https://www.flipkart.com/search?q=' + keyword +'&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off';
    //Launch Browser    
    const browser = await puppeteer.launch(options);
    var start = new Date().getTime();
    //New page Browser    
    const page = await browser.newPage();
    await page.goto(url);

    for(var i = 2; i < 4; i++) {
        try {

            var imgXpath = '//*[@id="container"]/div/div[3]/div[1]/div[2]/div[' + i + ']/div/div/div/a/div[1]/div[1]/div/div/img';
            var titleXpath = '//*[@id="container"]/div/div[3]/div[1]/div[2]/div[' + i + ']/div/div/div/a/div[2]/div[1]/div[1]';
            var priceXpath = '//*[@id="container"]/div/div[3]/div[1]/div[2]/div[' + i + ']/div/div/div/a/div[2]/div[2]/div[1]/div/div';
            var linkXpath = '//*[@id="container"]/div/div[3]/div[1]/div[2]/div[' + i + ']/div/div/div/a';
    
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
                source: 'flipkart'
            }

            json.push(data)
        } catch(error) {
            continue
        }
    }
    await browser.close();

    var end = new Date().getTime();
    var time = end - start;
    console.log("flipkart.js = " + time)

    return json;
}

module.exports = { scrape };

