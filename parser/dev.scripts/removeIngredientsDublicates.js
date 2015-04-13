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

};
