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
    console.log('Start adding counters');

    tempArr = ['сахар', 'мука']

    recipeModel.model
        .find({
            search: {
                $in: tempArr
            },
            $where: 'this.search.length <= ' + tempArr.length
        })
        .exec(function(error, data) {
            var delay = 100;

            data.forEach(function(recipe, index) {
                setTimeout(function () {
                    recipeModel.model.update(
                        {
                            _id: recipe._id
                        },
                        {
                            counter: index
                        },
                        function(err, data) {
                            console.log(recipe._id, '--->', index);
                        }
                    );
                }, delay * index);
            });
        });
};
