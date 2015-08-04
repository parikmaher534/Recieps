var mongoose = require('mongoose'),
    recipeModel = require('../../models/Recipe.js');


;(function (){
    mongoose.connect('127.0.0.1', 'WantToCook', 27017);
    mongoose.connection
        .once('open', function() {
            console.log('Connected to DB.');
            findDublicates();
        })
        .once('error', function(err) {
            console.log('error', 'Can\'t connect to DB. Mongoose connection error: ', err);
        });
}());


function findDublicates() {
    console.log('Start clear/repair data...');

    recipeModel.model
        .find()
        .exec(function(error, data) {
            data.forEach(function(recipe) {

                ;(function(recipe) {
                    var originName = recipe.name;

                    // Чистим имена от последствий парсинга
                    if (/(Варианты рецепта).+/.test(recipe.name)) {
                        recipe.name = recipe.name.replace(/(Варианты рецепта).+/, '');
                        console.log('Очистка: ', originName,' -> ', recipe.name);
                    }

                    recipeModel.model.update(
                        {
                            _id: recipe._id
                        },
                        {
                            name: recipe.name
                        },
                        function(err, data) {
                            if (!err) {
                                console.log(recipe.name, ' is done...');
                            } else {
                                console.log(recipe.name, ' dublicates remove error...');
                            }
                        }
                    );
                }(recipe));
            });
        });
};
