'use strict';

/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller should look. It currently
 * includes the minimum amount of functionality for the basics of Passport.js to work.
 */
var AuthController = {
	/**
	 * Log out a user and return them to the homepage
	 *
	 * Passport exposes a logout() function on request (also aliased as logOut()) that can be
	 * called from any route handler which needs to terminate a login session. Invoking logout()
	 * will remove the request.user property and clear the login session (if any).
	 *
	 * For more information on logging out users in Passport.js, check out:
	 * http://passportjs.org/guide/logout/
	 *
	 * @param   {Request}   request     Request object
	 * @param   {Response}  response    Response object
	 */
	logout : function ( request, response ) {
		request.logout();

    	request.session && request.session.destroy();

		response.json ( 200, true );
	},

	/**
	 * Create a third-party authentication endpoint
	 *
	 * @param   {Request}   request     Request object
	 * @param   {Response}  response    Response object
	 */
	provider : function ( request, response ) {
		sails.services['passport'].endpoint ( request, response );
	},

	/**
	 * Simple action to check current auth status of user. Note that this will always send
	 * HTTP status 200 and actual data will contain either user object or boolean false in
	 * cases that user is not authenticated.
	 *
	 * @todo    Hmmm, I think that this will return always false, because of missing of
	 *          actual sessions here...
	 *
	 * @param   {Request}   request     Request object
	 * @param   {Response}  response    Response object
	 */
	authenticated : function ( request, response ) {
		if ( request.isAuthenticated () ) {
			response.json ( 200, request.user );
		} else {
			response.json ( 200, false );
		}
	},

	/**
	 * Create a authentication callback endpoint
	 *
	 * This endpoint handles everything related to creating and verifying Passports
	 * and users, both locally and from third-party providers.
	 *
	 * Passport exposes a login() function on request (also aliased as logIn()) that
	 * can be used to establish a login session. When the login operation completes,
	 * user will be assigned to request.user.
	 *
	 * For more information on logging in users in Passport.js, check out:
	 * http://passportjs.org/guide/login/
	 *
	 * @param   {Request}   request     Request object
	 * @param   {Response}  response    Response object
	 */
	callback : function ( request, response ) {

    Logger.info({req: request}, 'Test log');
		PassportService.callback ( request, response, function ( error, user , info) {
      if (error) {
        return response.json(401, {message: error.message, key: error.type})
      }
			request.login ( user, function ( error ) {
				// If an error was thrown, redirect the user to the login which should
				// take care of rendering the error messages.
				if ( error ) {
					return response.json ( 401, error );
				}
				// Upon successful login, send back user data and JWT token

				var authUserId = _.isObject ( user.id ) ? user.id.toString () : user.id,
					userToken = JWTService.issue ( {id : authUserId} );
        response.json ( {
					user          : user.toFrontendJson(),
					token         : userToken
				} );

			} );
		} );
	},

	/**
	 * Action to check if given password is same as current user password. Note that
	 * this action is only allowed authenticated users. And by default given password
	 * is checked against to current user.
	 *
	 * @param   {Request}   request     Request object
	 * @param   {Response}  response    Response object
	 */
	checkPassword : function ( request, response ) {
		async.waterfall (
			[
				/**
				 * Job to fetch current user local passport data. This is needed
				 * to validate given password.
				 *
				 * @param   {Function}  callback    Callback function
				 */
					function ( callback ) {
					var where = {
						user     : request.token,
						protocol : 'local'
					};

					sails.models['passport']
						.findOne ( where )
						.exec ( function ( error, passport ) {
							if ( error ) {
								callback ( error );
							} else if ( !passport ) {
								callback ( {message : 'Given authorization token is not valid'} );
							} else {
								callback ( null, passport );
							}
						} );
				},
				/**
				 * Job to validate given password against user passport object.
				 *
				 * @param   {sails.model.passport}  passport    Passport object
				 * @param   {Function}              callback    Callback function
				 */
					function ( passport, callback ) {
					var password = request.param ( 'password' );

					passport.validatePassword ( password, function ( error, matched ) {
						if ( error ) {
							callback ( {message : 'Invalid password'} );
						} else {
							callback ( null, matched );
						}
					} );
				}
			],
			/**
			 * Main callback function which is called when all specified jobs are
			 * processed or an error has occurred while processing.
			 *
			 * @param   {null|Error}    error   Possible error
			 * @param   {null|boolean}  result  If passport was valid or not
			 */
			function ( error, result ) {
				if ( error ) {
					response.json ( 401, error );
				} else if ( result ) {
					response.json ( 200, result );
				} else {
					response.json ( 400, {message : 'Given password does not match.'} );
				}
			}
		);
	}

  // sendResetCode: function(req, res) {
  //   var email = req.body.email;
  //   sails.services['passport'].sendResetPasswordEmail(email, req, function(err, resetCode) {
  //     if (err) {
  //       return res.serverError(err.message);
  //     }
  //     return res.json({status:'ok'});
  //   })
  // },
  // checkCode: function(req, res) {
  //   var code = req.query.code;
  //   sails.models.passport.findOne({resetCode: code})
  //     .exec(function(err, passport) {
  //       if (err) {
  //         return res.serverError(err);
  //       }
  //       if (!passport) {
  //         return res.json({valid: false});
  //       }
  //       return res.json({valid: true});
  //     });
  // },


  // resetPassword: function(req, res) {
  //   var newPassword = req.body.newPassword,
  //       confirmPassword = req.body.confirmPassword,
  //       resetCode = req.body.code;
  //   if (!newPassword) {
  //     return res.badRequest('Please provide a new password');
  //   }
  //   if (newPassword !== confirmPassword) {
  //     return res.badRequest('Passwords don\'t match');
  //   }
  //   sails.models.passport.findOne({resetCode: resetCode})
  //     .exec(function(err, passport) {
  //       if (err) {
  //         return res.serverError(err);
  //       }
  //       if (!passport) {
  //         return res.badRequest('Invalid reset code');
  //       }
  //       sails.models.passport.update({id: passport.id}, {resetCode: null, password: newPassword})
  //         .exec(function(err, model) {
  //           if (err) {
  //             return res.serverError(err);
  //           }
  //           return res.json({status: 'ok'});
  //         })
  //     })
  // }
};

module.exports = AuthController;
