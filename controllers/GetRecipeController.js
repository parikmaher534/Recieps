module.exports = {

    init: function(req, res, next) {
        var id = req.query.id;

        if (id) {
            models.Recipe.findById(
                id,
                function(err, data) {
                    if (!err) {
                        res.send(data);
                    } else {
                        res.send({
                            error: 'Can\'t get recipe.'
                        });
                    }
                }
            );
        } else {
            res.send({});
        }
    }
};
