module.exports = {

    get: function(req, res, next) {
        models.Ingredient
            .find()
            .sort('name')
            .exec(function(err, data) {
                if (!err) {
                    res.send(data);
                } else {
                    res.send({
                        error: 'Can\'t get recipe.'
                    });
                }
            });
    },

    delete: function(req, res, next) {
        models.Ingredient.remove({_id: req.body.id}, function(err, data) {
            if (!err) {
                res.send({ status: 200 });
            } else {
                res.send({
                    error: 'Can\'t remove recipe.'
                });
            }
        });
    },

    put: function(req, res, next) {
        var params = req.body,
            update = {};

        update.name = params.name;
        update.sinonym = params.sinonym;

        models.Ingredient.update({_id: req.body.id}, update, function(err, data) {
            if (!err) {
                res.send({ status: 200 });
            } else {
                res.send({
                    error: 'Can\'t remove recipe.'
                });
            }
        });
    }
};
