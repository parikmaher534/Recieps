module.exports.routes = {

  'OPTIONS /*': function(req, res) {
      res.send(200);
  },

  // Authentication routes
  '/logout': 'AuthController.logout',
  'POST /login': 'AuthController.callback',
  'POST /login/:action': 'AuthController.callback',
  'POST /auth/local': 'AuthController.callback',
  'POST /auth/local/:action': 'AuthController.callback',
  'POST /auth/:provider': 'AuthController.callback',
  'POST /auth/:provider/:action': 'AuthController.callback',
  'POST /logout' : 'AuthController.logout',

  'get /me?': {
      controller: 'UserController',
      action: 'me'
  },

  'post /update?': {
      controller: 'UserController',
      action: 'update'
  },

  'get /structure?': {
      controller: 'MainController',
      action: 'all'
  }
};
