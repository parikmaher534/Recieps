var Crawler = require("crawler"),
    Q = require('Q');
    url = require('url'),
    mongoose = require('mongoose'),

    recipeModel = require('../models/Recipe.js'),
    recipeIngredientModel = require('../models/RecipeIngredient.js');



var grabURL = "http://www.edimdoma.ru",
    page = 2,
    pageMax = 200,
    links = [],
    linksGrabber = new Crawler({
        maxConnections : 100,
        callback : getReciepsLinks
    }),
    reciepGrabber = new Crawler({
        maxConnections : 100,
        callback : getReciepData
    });


//Просто коннект к базюльке
;(function() {
    mongoose.connect('127.0.0.1', 'WantToCook', 27017);
    mongoose.connection
        .once('open', function() {
            console.log('info', 'Mongoose was connected successfully.');

            recipeModel.model.remove(null, function() {});
            recipeIngredientModel.model.remove(null, function() {});
        })
        .once('error', function(err) {
            console.log('error', 'Mongoose connection error: ', err);
            process.exit();
        });
})();



function getReciepsLinks(error, result, $) {
    ++page;

    if( !error ) {
        $('.l-centercol .b-page_block__title a').each(function(i, a) {
            links.push($(a).attr('href'));
        });
    } else {
        console.log('Get page data error: ', error);
    }

    if( page <= pageMax ) {
        linksGrabber.queue(grabURL + '/retsepty?page=' + page);
    } else {
        getRecipesData();
    };
};

function getRecipesData() {
    links.forEach(function(a) {
        reciepGrabber.queue(a);
    });
};

function getReciepData(error, result, $) {
    var url = this.uri;

    recipeModel.model.create(
    {
        name         : $('.l-centercol .b-page_block__header .b-page_block__title').eq(0).text(),
        description  : $('.l-centercol .b-page_block__content').eq(1).text(),
        photo        : $('.l-centercol .rec-picture img').attr('src'),
        time         : $('.rec-cooktime').text().split(':')[1],
        linkToOrigin : url
    },
    function(err, recipeData) {
        var reciepsDefs, recipesIds, searchIngArr,
            resultContent = '';

        if( !err ) {
            recipesDefs = [];
            recipesIds = [];
            searchIngArr = [];

            $('.rec-ingred-table tr').each(function(i, el) {
                var recipeDef = Q.defer();
                recipesDefs.push(recipeDef.promise);

                recipeIngredientModel.model.create(
                {
                    amount: $(el).find('td').eq(1).text(),
                    ingredient: $(el).find('td').eq(0).text()
                },
                function(err, data) {
                    if( !err ) {
                        searchIngArr.push(data.ingredient);
                        recipesIds.push(data._id);
                        recipeDef.resolve();
                    } else {
                        console.log('Can\'t create recipe ingredient');
                    }
                });
            });

            Q.allResolved(recipesDefs)

            //Парсим контент рецептов
            .then(function() {
                $('.rec-sposob-inst').each(function(i, block) {
                    resultContent += '<div class="class-todo">' +
                                        $(block).find('.b-list__clause__pisture a').html() +
                                        $(block).find('.b-list__clause__text').text() +
                                     '</div>';
                });
            })

            //Пушим список ингредиентов в рецепт
            .then(function() {
                recipeModel.model.findByIdAndUpdate(
                    recipeData._id,
                    {
                        $push: {
                            ingredients: {
                                $each: recipesIds
                            }
                        },
                        $set: {
                            content: resultContent,
                            search: searchIngArr
                        }
                    },
                    function(err, data) {
                        if( !err ) {
                            console.log('GET: ', url);
                            console.log('--> ', data.name, '.');
                        } else {
                            console.log('Can\'t set ingredients to recipe: ', err);
                        }
                    }
                );
            });
        } else {
            console.log('Can\'t create recipe: ', err);
        }
    });
};

linksGrabber.queue(grabURL + '/retsepty');