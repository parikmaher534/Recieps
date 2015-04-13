var fs = require('fs'),
    request = require('request'),

    pageToDOM = require('../pageToDOM.js'),
    Q = require('q'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    recipeModel = require('../../models/Recipe.js');


// Тут храним сколько весят все загруженные картинки и каждый pack по отдельности
var CURRENT_SIZE = 0,
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
    var PACK_SIZE = 10,
        LOAD_DELAY = 1000;

    // Сразу выгребаем все рецепты
    // Сортируем для того чтобы при падении процесса выгрузки можно было
    // найти и продолжить с нужного места
    recipeModel.model
        .find()
        .limit(500)
        .sort({name: -1})
        .exec(function(err, docs) {
            var offset = 0,
                limit = 0,
                packs = Math.ceil(docs.length / PACK_SIZE),
                defs = [];

            console.log('All recipes was founded.');

            // Погнали перебирать все пакеты
            for (var i = 0; i < packs; i++) {
                ;(function() {
                    var dPack = Q.defer();
                    defs.push(dPack.promise);

                    ;(function(docs) {
                        var imgsAmount = 0,
                            imagesDefs = [];

                        // Перебираем все рецепты в пакете
                        for (var j = 0; j < docs.length; j++) {
                            ;(function(doc) {
                                var d = Q.defer(),
                                    imgsDefs = [],
                                    $ = cheerio.load(doc.content),
                                    imgs = [doc.photo];

                                imagesDefs.push(d.promise);

                                //Find all images in recipe
                                $('img').each(function(i, img) {
                                    imgs.push($(img).attr('src'));
                                });

                                imgsAmount += imgs.length;

                                //Load all recipe images
                                imgs.forEach(function(src) {
                                    var imgD = Q.defer();
                                    imgsDefs.push(imgD.promise);

                                    setTimeout(function() {
                                        download(src, '../dump_images/' + src.split('/').pop(), function() {
                                            imgD.resolve();
                                        });
                                    }, LOAD_DELAY * j * i);
                                });

                                Q.allResolved(imgsDefs).then(function() {
                                    d.resolve();
                                });
                            }(docs[j]));
                        };

                        Q.allResolved(imagesDefs).then(function() {
                            console.log('PACK LOADED('+ imgsAmount +' images). PACK SIZE: ', bytesToSize(CURRENT_SIZE));
                            CURRENT_SIZE = 0;
                            dPack.resolve();
                        });
                    }(docs.slice(limit, (limit += PACK_SIZE))));
                }());
            };

            // When all recipes images are loaded, show them total size on disk
            Q.allResolved(defs).then(function() {
                console.log('ALL PACKS LOADED. TOTAL UPLOADED SIZE: ', bytesToSize(GLOBAL_SIZE));
                process.exit(0);
            });
        });
};

function download(uri, filename, callback) {
    var size, imgReq, num;

    request.head(uri, function(err, res, body) {
        size = +res.headers['content-length'];
        num = isNumber(size) ? size : 0;

        CURRENT_SIZE += num;
        GLOBAL_SIZE += num;

        imgReq = request(uri).pipe(fs.createWriteStream(filename));
        imgReq.on('error', function(error) {
            console.log('Image load error: ', error);
        });
        imgReq.on('close', callback);
    });
};

function bytesToSize(bytes) {
   var  i,
        kb = 1024,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

   if (bytes == 0) return '0 Byte';

   i = parseInt(Math.log(bytes) / Math.log(kb));

   return +(bytes / Math.pow(kb, i)).toFixed(3) + ' ' + sizes[i];
};

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}