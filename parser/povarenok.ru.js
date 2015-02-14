var pageToDOM = require('./pageToDOM.js');
    Q = require('q');
    url = require('url'),
    mongoose = require('mongoose'),

    recipeModel = require('../models/Recipe.js'),
    recipeIngredientModel = require('../models/RecipeIngredient.js');

var from, to;
if (process.argv[2] && ~process.argv[2].indexOf('from')) from = process.argv[2].split('=')[1];
if (process.argv[3] && ~process.argv[3].indexOf('to')) to = process.argv[3].split('=')[1];

var grabURL = "http://www.povarenok.ru",
    page = from || 2,
    pageMax = to || 3,
    links = [];



// Просто коннект к базюльке
;(function() {
    mongoose.connect('127.0.0.1', 'WantToCookTest', 27017);
    mongoose.connection
        .once('open', function() {
            console.log('info', 'Mongoose was connected successfully.');

            pageToDOM.get({
                decode: true,
                url: grabURL + '/recipes/',
                callback: getReciepsLinks
            });
        })
        .once('error', function(err) {
            console.log('error', 'Mongoose connection error: ', err);
            process.exit();
        });
})();



function getReciepsLinks($) {
    ++page;

    $('.uno_recipie h1 a').each(function(i, a) {
        links.push($(a).attr('href'));
    });

    if (page <= pageMax) {
        pageToDOM.get({
            decode: true,
            url: grabURL + '/recipes/~' + page + '/',
            callback: getReciepsLinks
        });
    } else {
        getRecipesData();
    };
};

function getRecipesData() {
    var defs = [];

    links.forEach(function(a, i) {
        pageToDOM.get({
            decode: true,
            url: a,
            callback: function($) {
                defs.push(getReciepData($, a));

                // Когда все сграблено и записано в базу
                if (i == links.length - 1) {
                    Q.allResolved(defs).then(function() {
                        console.log('Job Done.');
                        process.exit();
                    });
                };
            }
        });
    });
};

function getReciepData($, url) {
    var d = Q.defer();

    var ingsQuery = $('#print_body .recipe-ing .cat');

    if (ingsQuery.length) {

        recipeModel.model.create(
        {
            name         : $('#print_body h1 a').text(),
            description  : $('#print_body .recipe-short span').text(),
            photo        : $('#print_body .recipe-img img').attr('src'),
            time         : $('#print_body .recipe-time-peaces time').text(),
            linkToOrigin : url
        },
        function(err, recipeData) {
            var reciepsDefs, recipesIds, searchIngArr,
                resultContent = '';

            if (!err) {
                recipesDefs = [];
                recipesIds = [];
                searchIngArr = [];

                ingsQuery.each(function(i, el) {
                    var recipeDef = Q.defer();
                    recipesDefs.push(recipeDef.promise);

                    recipeIngredientModel.model.create(
                    {
                        amount: $(el).find('span span').text(),
                        ingredient: $(el).find('span a span').text()
                    },
                    function(err, data) {
                        if (!err) {
                            searchIngArr.push(data.ingredient);
                            recipesIds.push(data._id);
                            recipeDef.resolve();
                        } else {
                            console.log('Can\'t create recipe ingredient');
                        }
                    });
                });

                Q.allResolved(recipesDefs)

                // Парсим контент рецептов
                .then(function() {
                    if( $('#print_body .recipe-steps table').length ) {
                        $('#print_body .recipe-steps table').each(function(i, block) {
                            resultContent += '<div class="class-todo">' +
                                                $(block).find('tr').find('td').eq(0).find('a').html() +
                                                $(block).find('tr').find('td').eq(1).text() +
                                             '</div>';
                        });
                    } else {
                        resultContent = '<div class="class-todo">' +
                                            $('#print_body .recipe-text').text() +
                                        '</div>';
                    }
                })

                // Пушим список ингредиентов в рецепт
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
                            if (!err) {
                                console.log('GET: ', url);
                                console.log('--> ', data.name, '.');
                            } else {
                                console.log('Can\'t set ingredients to recipe: ', err);
                            }

                            d.resolve();
                        }
                    );
                });
            } else {
                console.log('Can\'t create recipe: ', err);
                d.resolve();
            }
        });
    } else {

        // Если нет ингредиентов
        d.resolve();
    }

    return d.promise;
};