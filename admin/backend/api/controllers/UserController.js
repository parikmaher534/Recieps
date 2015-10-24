/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  	me: function(req, res) {
        var id = req.user.id,
            params = req.params.all();

        User.findOneById(id).exec(function(err, user){
            if (err) {
                return res.serverError(err);
            };

            if (params.hasOwnProperty('all')) {
                return res.json(user.toJSON());
            } else {
                return  res.json(user.toFrontendJson());
            }
        })
    },

    update: function(req, res) {
        var id = req.user.id,
            data = req.body.field;

        User.findOneById(id).exec(function(err, user) {
            if (!err) {
                if (data.name != 'password') {
                    user[data.name] = data.value;
                    user.save(function() {
                        return res.json({ status: 'ok' });
                    });
                } else {
                    var newPassword = data.newpass,
                        confirmPassword = data.newpassconfirm;

                    if (!newPassword) {
                        return res.badRequest('Please provide a new password');
                    };
                    if (newPassword !== confirmPassword) {
                        return res.badRequest('Passwords don\'t match');
                    };

                    sails.models.passport.find({user: id}, function(err, passport) {
                        sails.models.passport.update(
                            {
                                id: passport.id
                            },
                            {
                                resetCode: null,
                                password: newPassword
                            }
                        ).exec(function(err, model) {
                            if (err) {
                                return res.serverError(err);
                            };
                            return res.json({status: 'ok'});
                        });
                    });
                };
            } else {
                return res.json({ error: err });
            }
        });
    }
};
