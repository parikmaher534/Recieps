'use strict';

/**
 * Policy to check that request is done via authenticated user. This policy uses existing
 * JWT tokens to validate that user is authenticated. If use is not authenticate policy
 * sends 401 response back to client.
 *
 * @param   {Request}   request     Request object
 * @param   {Response}  response    Response object
 * @param   {Function}  next        Callback function
 *
 * @returns {*}
 */
module.exports = function(request, response, next) {

  console.log(request)

  if (!request.user || !request.isAuthenticated()) {
    return response.json(401, {message: 'Authorization required'});
  }

  var token;

  // Yeah we got required 'authorization' header
  if (request.headers && request.headers.authorization) {
    var parts = request.headers.authorization.split(' ');

    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];
      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {

      return response.json(401, {message: 'Invalid authorization header format. Format is Authorization: Bearer [token]'});
    }
  } else if (request.param('token')) { // JWT token sent by parameter
    token = request.param('token');

    // We delete the token from query and body to not mess with blueprints
    request.query && delete request.query.token;
    request.body && delete request.body.token;
  } else { // Otherwise request didn't contain required JWT token

    return response.json(401, {message: 'No authorization header was found'});
  }
  // Verify JWT token via service
  JWTService.verify(token, function(error, token) {
    if (error) {

      return response.json(401, {message: 'Given authorization token is not valid'});
    } else {
      if (token.id !== request.user.id) {
        return response.forbidden({message: 'You are not authorized to perform this action'});
      }
      // Store user id to request object
      request.token = token;

      return next();
    }
  });
};
