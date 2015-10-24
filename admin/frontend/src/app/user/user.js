(function () {

  'use strict';

  angular.module('dlux-ui.user', [
    'dlux-ui.user.dashboard'
  ]);

  angular.module('dlux-ui.user')
    .config(
    [
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('user', {
            data: {
              access: 1
            },
            views: {
              'content@': {
                controller: [
                  '$state',
                  function($state) {
                    $state.go('user.dashboard');
                  }
                ]
              }
            }
          });
      }
    ]
  );

}());
