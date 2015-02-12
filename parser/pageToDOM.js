var http = require('http'),
    cheerio = require('cheerio'),
    Q = require('q');


function getPageDOM(data) {
    var d = Q.defer(),
        outHTML = '';

    http.get(data.url, function(res) {
        res.on('data', function(chunk) {
            outHTML += chunk.toString();
        });

        res.on('end', d.resolve);
    })
    .on('error', d.reject);

    d.promise
        .fail(getPageError)
        .then(function() {
            data.callback(
                htmlToDOM(outHTML)
            );
        });
};

function htmlToDOM(html) {
    return cheerio.load(html);
};

function getPageError(error) {
    console.log('Can\'t get page:', error);
};


module.exports = {
    get: getPageDOM
};