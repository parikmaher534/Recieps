var fs = require('fs'),
    mongoose = require('mongoose'),
    recipeIngredientModel = require('../../models/RecipeIngredient.js');

mongoose.connect('127.0.0.1', 'WantToCook', 27017);
mongoose.connection
    .once('open', function() {
        var ingredients = {
                list: []
            };

        recipeIngredientModel.model.find().exec(function(err, docs) {
            docs.forEach(function(doc) {
                var ing = doc.ingredient.toLowerCase();

                if (ingredients.list.indexOf(ing) == -1) {
                    ingredients.list.push(ing);
                };
            });

            ingredients.list = ingredients.list.sort();

            fs.writeFile('ingredients.json', JSON.stringify(ingredients), function(err, a) {
                console.log(err, a)
            });
        });
    })
    .once('error', function(err) {
        console.log('error', 'Can\'t clear DB Mongoose connection error: ', err);
        process.exit();
    });