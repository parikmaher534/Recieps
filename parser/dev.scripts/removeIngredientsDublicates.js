var mongoose = require('mongoose'),
    recipeModel = require('../../models/Recipe.js'),
    ingredientModel = require('../../models/RecipeIngredient.js');


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
    console.log('Start find dublicates...');

    recipeModel.model
        .find()
        .exec(function(error, data) {
            data.forEach(function(recipe) {
                var search = [];

                recipe.search.forEach(function(ing) {
                    if (search.indexOf(ing) == -1) {
                        search.push(ing);
                    }
                });

                ;(function(recipe) {
                    recipeModel.model.update(
                        {
                            _id: recipe._id
                        },
                        {
                            search: search
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
