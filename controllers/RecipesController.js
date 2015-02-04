module.exports = {

    init: function(req, res, next) {
        var query = null,
            ingredients = req.query.ingredients,
            tempArr;

        if( ingredients ) {

            tempArr = ingredients.split(',');

            models.Recipe.find({}, function(err, data) {
                var result = [];

                //Перебираем все рецепты
                for( var i = 0; i < data.length; i++ ) {

                    //Если в рецепте ингредиентов меньше или равно кол-ву ингреиентов в холодильнике
                    if( data[i].search.length <= tempArr.length ) {
                        var status = 0;

                        //Если в рецепте есть все запрашиваемые ингредиенты
                        for( var j = 0; j < data[i].search.length; j++ ) {
                            if( ingredients.indexOf(data[i].search[j].toString()) == -1 ) {
                                status = -1;
                                break;
                            }
                        };

                        if( status != -1 ) result.push(data[i])
                    };
                };

                res.send(JSON.stringify(result));
            });

        } else {
            res.send({});
        }
    }
};