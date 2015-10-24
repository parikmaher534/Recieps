(function () {
  'use strict';
  angular.module('dlux-ui.auth',[
    'dlux-ui.auth.login',
    'dlux-ui.auth.register'
  ]);

  angular.module('dlux-ui.auth')
    .config(
    [
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('auth', {
            abstract: true,
            data: {
              access: 1
            }
          })
        ;
      }
    ]
  );
}());
