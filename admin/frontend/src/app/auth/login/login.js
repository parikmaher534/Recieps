;(function () {
    'use strict';

    angular.module('dlux-ui.auth.login', []);

    angular.module('dlux-ui.auth.login').config([
        '$stateProvider',
        function($stateProvider) {

            $stateProvider.state('auth.login', {
                url: '/login',
                data: { access: 0 },
                views: {
                    'content@': {
                        templateUrl: '/dlux-ui/auth/login/login.html',
                        controller: 'LoginController'
                    }
                }
            });
        }]
    );

}());
