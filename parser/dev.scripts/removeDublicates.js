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
    console.log('Start find dublicates...');

    recipeModel.model
        .find()
        .exec(function(error, data) {
            var recipesDublicates = [],
                ln = data.length;

            for (var i = 0; i < ln; i++) {

                if( data[i] ) {

                    for (var j = 0; j < ln; j++) {

                        if (data[j] && j !== i) {

                            if (
                                data[j].name == data[i].name &&
                                data[j].description == data[i].description
                            ) {

                                if (!~recipesDublicates.indexOf(data[j]._id)) {
                                    console.log('===> ',data[j].name, i, j);

                                    recipesDublicates.push(data[j]._id);
                                    delete data[j];
                                };
                            };
                        };
                    };

                    if (i % 200 === 0) console.log(i, 'recipes past...');
                }
            }

            console.log('Dublicates found: ', recipesDublicates.length);

            removeDublicates(recipesDublicates);
        });
};

function removeDublicates(recipesArr) {
    console.log('Start remove dublicates from DB...');

    recipeModel.model.remove({
        _id: {
            $in: recipesArr
        }
    }, function(err, data) {
        if (!err) {
            console.log('All dublicates was successfuly deleted.');
        } else {
            console.log('Can\'t delete dublicates: ', err);
        }

        process.exit();
    });
};
