var mongoose = require('mongoose'),
    recipeModel = require('../models/Recipe.js'),
    recipeIngredientModel = require('../models/RecipeIngredient.js');

mongoose.connect('127.0.0.1', 'WantToCook', 27017);
mongoose.connection
    .once('open', function() {
        recipeModel.model.remove(null, function() {});
        recipeIngredientModel.model.remove(null, function() {});
        console.log('DB was successfuly cleared');
        process.exit();
    })
    .once('error', function(err) {
        console.log('error', 'Can\'t clear DB Mongoose connection error: ', err);
        process.exit();
    });