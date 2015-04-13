var RECIPES;


function prepareRecipes(data, tempArr, ingredients) {
    var approximate,
        result = [];

    // Перебираем все рецепты
    for (var i = 0; i < data.length; i++) {

        // Если в рецепте ингредиентов меньше или равно кол-ву ингреиентов в холодильнике
        if (data[i].search.length <= tempArr.length) {
            var status = 0;

            // Если в рецепте есть все запрашиваемые ингредиенты
            for (var j = 0; j < data[i].search.length; j++) {
                if (ingredients.indexOf(data[i].search[j].toString()) == -1) {
                    status = -1;
                    break;
                }
            };

            if (status != -1) {
                result.push(data[i]);

            // Если точный совпадений нет, то ищем приближения
            } else {
                data[i] = data[i].toJSON();

                // Устанавливаем вес рецепта, для сортровки по наилучшему совпадению
                data[i].weight = 0;
                data[i].aproxIngs = [];

                for (var k = 0; k < data[i].search.length; k++) {
                    if (ingredients.indexOf(data[i].search[k].toString()) != -1) {
                        ++data[i].weight;
                        data[i].aproxIngs.push(data[i].search[k].toString());
                    }
                };
            }
        }
    }

    // Сортируем ингредиенты по набольшему содержанию нужных ингредиентов
    data = data.sort(function(a, b) {
        return b.weight - a.weight;
    });

    // Готовим данные для короткой выдачи
    result = result.map(function(item) {
        return {
            name: item.name,
            ingredients: item.search
        };
    });

    // По-умолчанию показываем первые 10 лучших совпадений
    approximate = data.slice(0, 10).map(function(item) {
        return {
            url: item.linkToOrigin,
            name: item.name,
            aprox: item.aproxIngs,
            ingredients: item.search
        };
    });

    return JSON.stringify({
                accurated: result,
                approximate: approximate
            });
};


module.exports = {

    init: function(req, res, next) {
        var query = null,
            ingredients = req.query.ingredients,
            tempArr;

        if (ingredients) {
            tempArr = ingredients.split(',');

            models.Recipe.find(
            {
                search: {
                    $in: tempArr
                },
                $where: 'this.search.length <= ' + tempArr.length
            },
            function(err, data) {

                if (!err) {
                    res.send(prepareRecipes(data, tempArr, ingredients));
                } else {
                    res.send({
                        error: 'Can\'t get recipes.'
                    });
                }
            });

        } else {
            res.send({});
        }
    }
};