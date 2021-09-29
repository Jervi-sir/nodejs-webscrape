const express = require('express')
var csrf = require('csurf')
var cookieParser = require('cookie-parser')
const path = require('path')
const bodyParser = require('body-parser')

const  scrapeAmazon =  require("./amazon")
const  scrapeFlipkart =  require("./flipkart")
const  scrapeGumtree =  require("./gumtree")

const puppeteer = require('puppeteer');
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
    var start = new Date().getTime();
    console.log(req.body)
    keyword = req.body.keyword;
    var json = [];
    var rrr = [];
    var rrr2 = [];
    var rrr = await amazon(keyword);
    var rrr2 = await flipkart(keyword);

    json = mergeJson(rrr, rrr2, rrr2)
    var end = new Date().getTime();
    var time = end - start;
    console.log("global = " + time)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json));
});

app.listen(3005,() => {
    console.log("server running on port bruh 3005")
})

/*-------------- scraper ------------*/

async function amazon(keyword) {
    return new Promise(resolve => {
        var start = new Date().getTime();
        
        scrapeAmazon.scrape(keyword).then((result) => {
            resolve(result);

            var end = new Date().getTime();
            var time = end - start;
            console.log("amanzon.promise = " + time)
        })
    });
}

async function flipkart(keyword) {
    return new Promise(resolve => {
        var start = new Date().getTime();
        
        scrapeFlipkart.scrape(keyword).then((result) => {
            resolve(result);

            var end = new Date().getTime();
            var time = end - start;
            console.log("flipkart.promise = " + time)
        })
    });
}

async function gumtree(keyword) {
    return new Promise(resolve => {
        scrapeGumtree.scrape(keyword).then((result) => {
            resolve(result);
        })
    });
}

function mergeJson() {
    var json = [];
    for(var i = 0; i < arguments.length; i++) {
        json = json.concat(arguments[i])
    }
    return json;
}



/*
amazon('lenovo').then((result) => {
        console.log(result)
        var rrr = json;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(rrr));
    })
    */