(function () {
  'use strict';
  angular.module('dlux-ui.auth.register', []);

  angular.module('dlux-ui.auth.register')
    .config(
    [
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('auth.register', {
            url: '/register',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/dlux-ui/auth/register/register.html',
                controller: 'RegisterController'
              }
            }
          })
        ;
      }
    ]
  );

}());
