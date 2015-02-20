var pageToDOM = require('../pageToDOM.js');
    Q = require('q');
    url = require('url'),
    mongoose = require('mongoose'),

    recipeModel = require('../../models/Recipe.js'),
    recipeIngredientModel = require('../../models/RecipeIngredient.js');


var page = 0,
    grabURL = "http://gotovim-doma.ru",
    categories = [
        'http://gotovim-doma.ru/view.php?g=1',
        'http://gotovim-doma.ru/view.php?g=2',
        'http://gotovim-doma.ru/view.php?g=3',
        'http://gotovim-doma.ru/view.php?g=4',
        'http://gotovim-doma.ru/view.php?g=5',
        'http://gotovim-doma.ru/view.php?g=6',
        'http://gotovim-doma.ru/view.php?g=7',
        'http://gotovim-doma.ru/view.php?g=42'
    ],
    links = [];


// Просто коннект к базюльке
;(function() {
    mongoose.connect('127.0.0.1', 'WantToCook', 27017);
    mongoose.connection
        .once('open', function() {
            console.log('info', 'Mongoose was connected successfully.');

            aggregateLinksFromAllCategories();
        })
        .once('error', function(err) {
            console.log('error', 'Mongoose connection error: ', err);
            process.exit();
        });
})();



function aggregateLinksFromAllCategories($) {
    //var defs = [];

    //categories.forEach(function(link) {
        // var d = Q.defer();
        // defs.push(d.promise);

        pageToDOM.get({
            //url: link,
            decode: true,
            url: categories[0],
            callback: function($) {
                $('.rcplist tr td a').each(function(i, a) {
                    links.push(grabURL + $(a).attr('href'));
                });

                //d.resolve();

                getRecipesData();
            }
        });
    //});

    // Q.allResolved(defs).then(function() {
    //     getRecipesData();
    // });
};


function getRecipesData() {
    var defs = [];

    links.forEach(function(a, i) {
        setTimeout(function() {
            pageToDOM.get({
                decode: true,
                url: a,
                callback: function ($) {
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
        }, 1000 * i)
    });
};

function getReciepData($, url) {
    var d = Q.defer();

    var ingsQuery = $('.rcpstru');

    if (ingsQuery.length) {

        recipeModel.model.create(
        {
            name         : $('.rcptitle').text(),
            description  : $('.rcpdescr').text(),
            photo        : grabURL + $('.rcpdescr').next().find('img').attr('src'),
            time         : null,
            linkToOrigin : url
        },
        function(err, recipeData) {
            var reciepsDefs, recipesIds, searchIngArr,
                resultContent = '';

            if (!err) {
                recipesDefs = [];
                recipesIds = [];
                searchIngArr = [];

                ingsQuery.find('li').each(function(i, el) {
                    var recipeDef = Q.defer(),
                        ingred = $(el).text().split(' - ');

                    recipesDefs.push(recipeDef.promise);

                    recipeIngredientModel.model.create(
                    {
                        amount: ingred[1],
                        ingredient: ingred[0]
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
                    $('.instructions .rcptxt').each(function(i, block) {
                        resultContent += '<div class="class-todo">' +
                                            ($(block).prev() ? $(block).prev().html() : '') +
                                            $(block).text() +
                                         '</div>';
                    });
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