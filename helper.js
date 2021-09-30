function mergeJson() {
    var json = [];
    for(var i = 0; i < arguments.length; i++) {
        json = json.concat(arguments[i])
    }
    return json;
}

function currencyCnv(price) {
    var currency = price.slice(0, 1);
    //no comma no dot no currency
    var price = price.slice(1).replace(/,/g, '').split('.')[0];
    if(currency == "₹") {
        var total = price * 0.013;
        total = Number((total).toFixed(0))
        return total;
    }

    if(currency == "£") {
        var total = price * 1.34;
        total = Number((total).toFixed(0))
        return total;
    }

    if(currency == "€") {
        var total = price * 1.16;
        total = Number((total).toFixed(0))
        return total;
    }

    if(currency == "$") {
        total = Number((total).toFixed(0))
        return total;
    }
    else {
        return 0;
    }
}

function notNaN(x) {
    return !(x !== x);
}

function hasNumber(myString) {
    return /\d/.test(myString);
}


module.exports = { mergeJson, currencyCnv, notNaN, hasNumber };

/*
var price = 1470000;

let dollarUSLocale = Intl.NumberFormat('en-US');
let dollarIndianLocale = Intl.NumberFormat('en-IN');

console.log("US Locale output: " + dollarUSLocale.format(price));
console.log("Indian Locale output: " + dollarIndianLocale.format(price));*
*/