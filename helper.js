function mergeJson() {
    var json = [];
    for(var i = 0; i < arguments.length; i++) {
        json = json.concat(arguments[i])
    }
    return json;
}

module.exports = { mergeJson };
