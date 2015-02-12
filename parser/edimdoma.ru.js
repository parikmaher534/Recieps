var pageToDOM = require('./pageToDOM.js');
    Q = require('Q');
    url = require('url'),
    mongoose = require('mongoose'),

    recipeModel = require('../models/Recipe.js'),
    recipeIngredientModel = require('../models/RecipeIngredient.js');


var from, to;
if(process.argv[2] && ~process.argv[2].indexOf('from')) from = process.argv[2].split('=')[1];
if(process.argv[3] && ~process.argv[3].indexOf('to')) to = process.argv[3].split('=')[1];

var grabURL = "http://www.edimdoma.ru",
    page = from || 2,
    pageMax = to || 3,
    links = [];

//Просто коннект к базюльке
;(function() {
    mongoose.connect('127.0.0.1', 'WantToCook', 27017);
    mongoose.connection
        .once('open', function() {
            console.log('info', 'Mongoose was connected successfully.');

            pageToDOM.get({
                url: grabURL + '/retsepty',
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

    $('.l-centercol .b-page_block__title a').each(function(i, a) {
        links.push($(a).attr('href'));
    });

    if( page <= pageMax ) {
        pageToDOM.get({
            url: grabURL + '/retsepty?page=' + page,
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
            url: a,
            callback: function ($) {
                defs.push(getReciepData($, a));

                //Когда все сграблено и записано в базу
                if( i == links.length - 1 ) {
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

    recipeModel.model.find(
    {
        name: $('.l-centercol .b-page_block__header .b-page_block__title').eq(0).text(),
    },
    function(err, doc) {

        //Если у нас нет ещё рецепта с таким именем то качаем
        if( !err && !doc.length ) {
            var ingsQuery = $('.rec-ingred-table tr');

            if( ingsQuery.length ) {

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

                        ingsQuery.each(function(i, el) {
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

                //Если нет ингредиентов
                d.resolve();
            }
        } else {
            //Значит рецепт есть.
            d.resolve();
        }
    });

    return d.promise;
};