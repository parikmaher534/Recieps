var http = require('http'),
    cheerio = require('cheerio'),
    Iconv = require('iconv').Iconv,
    Q = require('q');


function getPageDOM(data) {
    var d = Q.defer(),
        outHTML = '';

    http.get(data.url, function(res) {
        if( data.decode ) res.setEncoding('binary');

        res.on('data', function(chunk) {
            if( data.decode ) {
                chunk = new Buffer(chunk, 'binary');
                chunk = new Iconv('windows-1251', 'utf8').convert(chunk).toString();
                outHTML += chunk;
            } else {
                outHTML += chunk.toString();
            }
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