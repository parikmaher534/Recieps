'use strict';

/**
 * JWTService.js
 *
 * JWT token service which handles issuing and verifying tokens.
 */
var jwt = require ( 'jsonwebtoken' );

/**
 * Service method to generate a new token based on payload we want to put on it.
 *
 * @param   {Object}    payload
 *
 * @returns {*}
 */
module.exports.issue = function ( payload ) {
  return jwt.sign (
    payload, // This is the payload we want to put inside the token
    process.env.JWT_SECRET || sails.config.jwtSecret,

    {expiresInMinutes: 10080} //One week;
  );
};

/**
 * Service method to verify that the token we received on a request hasn't be tampered with.
 *
 * @param   {String}    token   Token to validate
 * @param   {Function}  next    Callback function
 *
 * @returns {*}
 */
module.exports.verify = function ( token, next ) {
  return jwt.verify (
    token, // The token to be verified
    process.env.JWT_SECRET || sails.config.jwtSecret,
    {ignoreExpiration: false}, // Options, none in this case
    next // The callback to be call when the verification is done.
  );
};
/**
 * Created by anri on 11/09/15.
 */
