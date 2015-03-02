var fs = require('fs'),
    request = require('request'),

    pageToDOM = require('../pageToDOM.js'),
    Q = require('q'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),

    recipeModel = require('../../models/Recipe.js'),

    GLOBAL_SIZE = 0;


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
    var LOAD_DELAY = 2000;

    recipeModel.model
        .find()
        .limit(100)
        .exec(function(err, docs) {
            var imagesDefs = [];

            //Loop all recipes
            docs.forEach(function(doc) {
                var d = Q.defer(),
                    imgsDefs = [],
                    $ = cheerio.load(doc.content),
                    imgs = [doc.photo];

                imagesDefs.push(d.promise);

                //Find all images in recipe
                $('img').each(function(i, img) {
                    imgs.push($(img).attr('src'));
                });

                //Load all recipe images
                imgs.forEach(function(src, i) {
                    var imgD = Q.defer();
                    imgsDefs.push(imgD.promise);

                    setTimeout(function() {
                        download(src, '../dump_images/' + src.split('/').pop(), function() {
                            imgD.resolve();
                        });
                    }, LOAD_DELAY * i);
                });

                Q.allResolved(imgsDefs).then(function() {
                    console.log(doc.name, ' images was loaded. Recipe ID: ', doc._id);
                    d.resolve();
                });
            });

            Q.allResolved(imagesDefs).then(function() {
                console.log('All images loaded.');
                console.log('TOTAL SIZE: ', bytesToSize(GLOBAL_SIZE));
                process.exit();
            });
        });
};

function download(uri, filename, callback){
    request.head(uri, function(err, res, body) {
        GLOBAL_SIZE += +res.headers['content-length'];
        console.log('File ', uri,' size: ', bytesToSize(+res.headers['content-length']))

        var r = request(uri).pipe(fs.createWriteStream(filename));
        r.on('close', callback);
    });
};

function bytesToSize(bytes) {
   var  i,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

   if (bytes == 0) return '0 Byte';

   i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};