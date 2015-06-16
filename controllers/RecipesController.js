var RECIEPS_OFFSET = 10;

function prepareRecipes(data, tempArr, ingredients) {
    var approximate,
        result = [];

    // Перебираем все рецепты
    for (var i = 0; i < data.length; i++) {

        // Если в рецепте ингредиентов меньше или равно кол-ву ингредиентов в холодильнике
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

            // Если точных совпадений нет, то ищем приближения
            } else {
                data[i] = data[i].toJSON();

                // Устанавливаем вес рецепта, для сортировки по наилучшему совпадению
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
            ingredients: item.search,
            all: item
        };
    });

    // По-умолчанию показываем первые 'RECIEPS_OFFSET' лучших совпадений
    approximate = data.slice(0, RECIEPS_OFFSET).map(function(item) {

        // Выделяем нехватающие элементы
        var other = [];

        item.search.forEach(function(searchItem) {
            if (
                item.aproxIngs &&
                item.aproxIngs.indexOf(searchItem) == -1
            ) {
                other.push(searchItem);
            };
        });

        return {
            url: item.linkToOrigin,
            name: item.name,
            aprox: item.aproxIngs,
            ingredients: item.search,
            other: other,
            all: item
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

        if (
            ingredients &&
            typeof ingredients == 'string'
        ) {
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