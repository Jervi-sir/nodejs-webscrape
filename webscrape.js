const puppeteer = require('puppeteer');
const helper =  require("./helper")

var jsonAmazon = [];
var jsonFlipkart = [];

let dollarUSLocale = Intl.NumberFormat('en-US');

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
    var launchBrowserGlobal = new Date().getTime();

    var launchBrowser = new Date().getTime();
    const browser = await puppeteer.launch(options);
    console.log("%c launch browser = " + ((new Date().getTime()) - launchBrowser), 'color: green');

    var promiseScrape = new Date().getTime();
    await Promise.all([amazon(keyword, browser), flipkart(keyword, browser)]);
    console.log("%c webscrape parallel = " + ((new Date().getTime()) - promiseScrape), 'color: green');

    var json = helper.mergeJson(jsonAmazon, jsonFlipkart);  

    var browserClose = new Date().getTime();
    await browser.close();
    console.log("%c browser close = " + ((new Date().getTime()) - browserClose), 'color: red');

    console.log("%c all web scraping = " + ((new Date().getTime()) - launchBrowserGlobal), 'color: red');
    return json;
}

async function amazon(keyword, browser) {
    var amazonStart = new Date().getTime();

    jsonAmazon = [];
    keyword = keyword.replace(/ /g, '+');
    var url = 'https://www.amazon.com/s?k=' + keyword +'+&ref=nb_sb_noss';
    //New page Browser    
    var amazonNewPage = new Date().getTime();
    const page = await browser.newPage();
    console.log("%c AMAZON new page = " + ((new Date().getTime()) - amazonNewPage), 'color: #');


    var amazonGotoUrl = new Date().getTime();
    await page.goto(url);
    console.log("%c AMAZON goto url = " + ((new Date().getTime()) - amazonGotoUrl), 'color: #');
    
    var amazonScrapeData = new Date().getTime();
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
            
            var VpriceAmount = helper.hasNumber(price) ? helper.currencyCnv(price) : 0;
            var Vprice = helper.hasNumber(price) ? '$' + dollarUSLocale.format(helper.currencyCnv(price)) : "not mentioned 🤔";

            var data = {
                id: 'amazon' + i,
                order: '',
                image: img,
                title: title.split(' ').slice(0, 4).join(' '),
                subtitle: title.split(' ').slice(4, 10).join(' '),
                priceAmount: VpriceAmount,
                price: Vprice,
                link: link,
                source: 'amazon'
            }
            jsonAmazon.push(data);
        } catch(error) {
            continue
        }
    }
    console.log("%c AMAZON scrape data = " + ((new Date().getTime()) - amazonScrapeData), 'color: #');

    var amazonClosePage = new Date().getTime();
    await page.close();
    console.log("%c AMAZON close page = " + ((new Date().getTime()) - amazonClosePage), 'color: #');

    console.log("%c all AMAZON scrape = " + ((new Date().getTime()) - amazonStart), 'color: #');
    return jsonAmazon;
}

async function flipkart(keyword, browser) {
    var flipkartStart = new Date().getTime();

    jsonFlipkart = [];
    var keyword = keyword.replace(/ /g, '%20') 
    var url = 'https://www.flipkart.com/search?q=' + keyword +'&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off';
   
    //New page Browser    
    var flipkartNewPage = new Date().getTime();
    const page = await browser.newPage();
    console.log("%c FLIPKART new page = " + ((new Date().getTime()) - flipkartNewPage), 'color: green');

    var flipkartGotoUrl = new Date().getTime();
    await page.goto(url);
    console.log("%c FLIPKART goto url = " + ((new Date().getTime()) - flipkartGotoUrl), 'color: green');

    var flipkartScrape = new Date().getTime();
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
            
            var VpriceAmount = helper.hasNumber(price) ? helper.currencyCnv(price) : 0;
            var Vprice = helper.hasNumber(price) ? '$' + dollarUSLocale.format(helper.currencyCnv(price)) : "not mentioned 🤔";

            var data = {
                id: 'flipkart' + i,
                order: '',
                image: img,
                title: title.split(' ').slice(0, 4).join(' '),
                subtitle: title.split(' ').slice(4, 10).join(' '),
                priceAmount: VpriceAmount,
                price: Vprice,
                link: link,
                source: 'flipkart'
            }

            jsonFlipkart.push(data)
        } catch(error) {
            continue
        }
    }
    console.log("%c FLIPKART scrape = " + ((new Date().getTime()) - flipkartScrape), 'color: green');
    
    var flipkartClosePage = new Date().getTime();
    await page.close();
    console.log("%c FLIPKART close page = " + ((new Date().getTime()) - flipkartClosePage), 'color: green');

    console.log("%c all FLIPKART scrape = " + ((new Date().getTime()) - flipkartStart), 'color: green');
    return jsonFlipkart;
}

module.exports = { launchBrowser, amazon, flipkart };
