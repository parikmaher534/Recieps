'use strict';

var validator = require ( 'validator' );
/**
 * Local Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 *
 * For more information on local authentication in Passport.js, check out:
 * http://passportjs.org/guide/username-password/
 */

exports.register = function ( req, res, next ) {
	// var email = req.param ( 'email' )
	// 	, username = req.param ( 'email' )
	// 	, password = req.param ( 'password' );

	// if ( !email ) {
	// 	return next ( new Errors.AuthError('No email was entered.', 'email'), false );
	// }

	// if ( !password ) {
	// 	return next ( new Errors.AuthError('No password was entered.', 'password'), false );
	// }

	// User.findOne({email: email}).exec(function(err, user) {
	// 	if (user) {
	// 	  	next(new Errors.AuthError(Errors.messages.emailTaken), null);
	// 	} else {
	// 		var params = req.params.all();

	// 		delete params.password;
	// 		delete params.action;

	// 		User.create ( params, function ( err, user ) {
	// 			if ( err ) {
	// 				if ( err.code === 'E_VALIDATION' ) {
	// 			    	return next ( new Errors.AuthError('Validation error', 'validation'), false );
	// 				}
	// 				return next ( err );
	// 			};
	// 			Passport.create ( {
	// 				  protocol : 'local',
	// 				  password : password,
	// 				  user     : user.id
	// 			}, function ( err, passport ) {
	// 				  var error;

	// 				  if ( err ) {
	// 					    if ( err.code === 'E_VALIDATION' ) {
	// 				     	 	error = new Errors.AuthError(Errors.messages.shortPassword, 'password')
	// 					    }
	// 					    return User.destroy (user.id, function ( destroyErr ) {
	// 					      	next ( destroyErr || error );
	// 					    } );
	// 				  }

	// 				  next ( null, user );
	// 			});
	// 		});
	// 	}
	// });
};

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param   {Object}   request
 * @param   {Object}   response
 * @param   {Function} next
 */
exports.connect = function ( request, response, next ) {
	var user = request.user;
	var password = request.param ( 'password' );

	sails.models['passport']
		.findOne ( {
			protocol : 'local',
			user     : user.id
		} )
		.exec ( function ( error, passport ) {
			if ( error ) {
				next ( error );
			} else {
				if ( !passport ) {
					sails.models['passport']
						.create ( {
							protocol : 'local',
							password : password,
							user     : user.id
						} )
						.exec ( function ( error ) {
							next ( error, user );
						} );
				} else {
					next ( null, user );
				}
			}
		} );
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param   {Object}   request
 * @param   {string}   identifier
 * @param   {string}   password
 * @param   {Function} next
 */
exports.login = function ( request, identifier, password, next ) {
	var isEmail = validator.isEmail ( identifier );
	var query = {};

	if ( isEmail ) {
		query.email = identifier;
	} else {
		query.username = identifier;
	}

	sails.models['user']
		.findOne ( query )
		.exec ( function ( error, user ) {
			if ( error ) {
				next ( error );
			} else if ( !user ) {
				next ( new Errors.AuthError('Email was not found', 'email'), false );
			} else {
				sails.models['passport']
					.findOne ( {
						protocol : 'local',
						user     : user.id
					} )
					.exec ( function ( error, passport ) {
						if ( passport ) {
							passport.validatePassword ( password, function ( error, response ) {
								if ( error ) {
									next ( error );
								} else if ( !response ) {
									next ( new Errors.AuthError('Invalid password', 'password'), false );
								} else {
									next ( null, user );
								}
							} );
						} else {
							next ( new Errors.AuthError('Invalid password', 'password'), false );
						}
					} );
			}
		} );
};
