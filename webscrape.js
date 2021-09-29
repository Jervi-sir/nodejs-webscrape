const puppeteer = require('puppeteer');
const helper =  require("./helper")

var jsonAmazon = [];
var jsonFlipkart = [];

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

async function launchBrowser(keyword) {
    const browser = await puppeteer.launch(options);
    await Promise.all([amazon(keyword, browser), flipkart(keyword, browser)]);
    var json = helper.mergeJson(jsonAmazon, jsonFlipkart);  
    await browser.close();
    return json;
}

async function amazon(keyword, browser) {
    jsonAmazon = [];
    keyword = keyword.replace(/ /g, '+');
    var url = 'https://www.amazon.com/s?k=' + keyword +'+&ref=nb_sb_noss';
    //New page Browser    
    const page = await browser.newPage();
    await page.goto(url);
    
    for(var i = 2; i < 18; i++) {
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

            jsonAmazon.push(data);
        } catch(error) {
            continue
        }
    }
    await page.close();
    return jsonAmazon;
}

async function flipkart(keyword, browser) {
    jsonFlipkart = [];
    var keyword = keyword.replace(/ /g, '%20') 
    var url = 'https://www.flipkart.com/search?q=' + keyword +'&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off';
    //New page Browser    
    const page = await browser.newPage();
    await page.goto(url);

    for(var i = 2; i < 18; i++) {
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

            jsonFlipkart.push(data)
        } catch(error) {
            continue
        }
    }
    await page.close();
    return jsonFlipkart;
}

module.exports = { launchBrowser, amazon, flipkart };
