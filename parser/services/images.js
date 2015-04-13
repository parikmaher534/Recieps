var fs = require('fs'),
    request = require('request'),

    pageToDOM = require('../pageToDOM.js'),
    Q = require('q'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),

    recipeModel = require('../../models/Recipe.js');


// Просто коннект к базюльке
;(function() {
    mongoose.connect('127.0.0.1', 'WantToCook', 27017);
    mongoose.connection
        .once('open', function() {
            console.log('info', 'Mongoose was connected successfully.');

            getImages();
        })
        .once('error', function(err) {
            console.log('error', 'Mongoose connection error: ', err);
            process.exit();
        });
})();


function getImages() {
    recipeModel.model
        .find()
        .exec(function(err, docs) {
            docs.forEach(function(doc, j) {
                setTimeout(function() {
                    var $ = cheerio.load(doc.content),
                        imgs = [doc.photo];

                    $('img').each(function(i, img) {
                        imgs.push($(img).attr('src'));
                    });

                    imgs.forEach(function(src, i) {
                        setTimeout(function() {
                            download(src, src.split('/').pop(), function(){
                                console.log(src, ' done downloading...');
                            });
                        }, 1000 * i);
                    });
                }, 1000 * j);
            });
        }) ;
};

function download(uri, filename, callback){
    request.head(uri, function(err, res, body){
        var r = request(uri).pipe(fs.createWriteStream(filename));
        r.on('close', callback);
    });
};