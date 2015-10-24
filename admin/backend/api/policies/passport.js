var passport = require('passport');

module.exports = function(request, response, next) {

  // Initialize Passport
  passport.initialize()(request, response, function() {
    // Use the built-in sessions
    passport.session()(request, response, function() {

      // Make the user available throughout the frontend
      response.locals.user = request.user;
      next();
    });
  });
};
