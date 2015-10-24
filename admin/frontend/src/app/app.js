;(function () {

  'use strict';

  angular.module('dlux-ui', [
    'ui.router',
    'ui.bootstrap',
    'dlux-ui.directives',
    'dlux-ui.filters',
    'dlux-ui.services',
    'dlux-ui.controllers',
    'dlux-ui.interceptors',
    'dlux-ui.auth',
    'dlux-ui.user',
    'dlux-ui.ingredients',
    'dlux-ui.settings',
    'dlux-ui.buildSettings',
    'cgNotify'
  ]);

  angular.module('dlux-ui')
    .config([
      '$locationProvider',
      '$httpProvider',
      '$urlRouterProvider',
      function($locationProvider, $httpProvider, $urlRouterProvider) {
          $locationProvider.html5Mode(true);

          $httpProvider.defaults.useXDomain = true;

          $httpProvider.defaults.withCredentials = true;

          $httpProvider.defaults.headers['Cache-Control'] = 'no-cache';
          $httpProvider.defaults.headers['Pragma'] = 'no-cache';

          delete $httpProvider.defaults.headers.common['X-Requested-With'];

          $httpProvider.interceptors.push('AuthInterceptor');

          $urlRouterProvider.otherwise('/user/dashboard');
      }]);

  angular.module('dlux-ui')
      .run([
        '$rootScope', '$state',
        'Auth', '$location',
        function run($rootScope, $state, Auth) {
            $rootScope.$on('$stateChangeStart', function stateChangeStart(event, toState, toParams, fromState, fromParams) {
                var userIsAuthorized = Auth.authorize(toState.data.access);

                fromState && console.log('Going from ' + fromState.name + ' to ' + toState.name);

                if ( !userIsAuthorized ) {
                    event.preventDefault();
                    $state.go('auth.login');
                };
            });
        }
      ]);

}());
