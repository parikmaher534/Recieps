var RECIEPS_LIMIT = 10,
    RECIEPS_OFFSET = 0,
    APPROX_REC_LIMIT = RECIEPS_LIMIT / 2,
    APPROX_REC_OFFSET = 0,
    TOTAL_AMOUNT = 0;

function prepareRecipes(data, tempArr, ingredients) {
    var approximate, _result,
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

    TOTAL_AMOUNT = result.length;

    // Готовим данные для короткой выдачи
    _result = result.slice(RECIEPS_OFFSET, RECIEPS_OFFSET + RECIEPS_LIMIT).map(function(item) {
        return {
            name: item.name,
            ingredients: item.search,
            all: item
        };
    });

    // По-умолчанию показываем первые 'RECIEPS_LIMIT / 2' лучших совпадений
    approximate = data.slice(APPROX_REC_OFFSET, APPROX_REC_OFFSET + APPROX_REC_LIMIT).map(function(item) {

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
                accurated: _result,
                approximate: approximate,
                offset: RECIEPS_OFFSET,
                limit: RECIEPS_LIMIT,
                paginator: {
                    total: {
                        acc: result.length,
                        app: data.length
                    },
                    amount: {
                        acc: _result.length,
                        app: approximate.length
                    }
                }
            });
};


module.exports = {

    init: function(req, res, next) {
        var query = null,
            ingredients = req.query.ingredients,
            params = req.query,
            tempArr;

        if (params) {
            RECIEPS_LIMIT = params.accLimit || RECIEPS_LIMIT;
            RECIEPS_OFFSET = params.accOffset || RECIEPS_OFFSET;

            APPROX_REC_LIMIT = params.appLimit || APPROX_REC_LIMIT;
            APPROX_REC_OFFSET = params.appOffset || APPROX_REC_OFFSET;
        };

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
                }
            )
            .exec(
                function(err, data) {
                    console.timeEnd('test');
                    if (!err) {
                        res.send(prepareRecipes(data, tempArr, ingredients, params));
                    } else {
                        res.send({
                            error: 'Can\'t get recipes.'
                        });
                    }
                }
            );

        } else {
            res.send({});
        }
    }
};