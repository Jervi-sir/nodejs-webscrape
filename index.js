const express = require('express')
var csrf = require('csurf')
var cookieParser = require('cookie-parser')
const path = require('path')
const bodyParser = require('body-parser')
const helper =  require("./helper")

const  scrapeAmazon =  require("./amazon")
const  scrapeFlipkart =  require("./flipkart")
const  scrapeGumtree =  require("./gumtree")

const  scrape =  require("./webscrape")


const { resolve } = require('path')

// setup route middlewares
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

// create express app
var app = express()

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", csrfProtection, (req, res) => {
    res.render('index', { csrfToken: req.csrfToken() })
});

app.post("/search", parseForm, csrfProtection,async (req, res) => {
    var globalAll = new Date().getTime();

    console.log(req.body)

    keyword = req.body.keyword;

    var globalScrape = new Date().getTime(); 
    var resultt = await nodeScrape(keyword);

    console.log("globalScrape = " + ((new Date().getTime()) - globalScrape));
    console.log("globalAll = " + ((new Date().getTime()) - globalAll));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resultt));
});

app.listen(process.env.PORT || 3000,() => {
    console.log("server running on port bruh 3000")
})

/*-------------- scraper ------------*/
async function nodeScrape(keyword) {
    return new Promise(resolve => {
        var globalScrape = new Date().getTime();
        scrape.launchBrowser(keyword).then((result) => {
            console.log("async call scrape = " + ((new Date().getTime()) - globalScrape))
            resolve(result);
        })
    });
}



/*
amazon('lenovo').then((result) => {
        console.log(result)
        var rrr = json;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(rrr));
    })
    */