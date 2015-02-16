var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    cheerio = require('cheerio'),
    Iconv = require('iconv').Iconv,
    Q = require('q'),
    spawn = require('child_process').spawn;



function getPageDOM(data) {
    var html = '';

    var name = url.parse(data.url).path.replace(/\//g, '_');

    var wget = spawn('wget', ['-L', '-O', './wget/' + name, '--proxy', '112.78.150.30:8080', data.url]);

    wget.on('close', function(code) {
        if (code == 0) {
            html = fs.readFileSync('./wget/' + name);
            html = new Iconv('windows-1251', 'utf8').convert(new Buffer(html, 'binary')).toString();

            data.callback(htmlToDOM(html));
        } else {
            getPageError('Ошибонька: status code ', code);
        }

        console.log('Done: ', './wget/' + name);
        fs.unlinkSync('./wget/' + name);
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