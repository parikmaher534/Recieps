;(function () {

    'use strict';

    angular.module('dlux-ui.user.dashboard', []);

    angular.module('dlux-ui.user.dashboard').config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('user.dashboard', {
                url: '/user/dashboard',
                data: {
                    access: 1
                },
                views: {
                    'content@': {
                        templateUrl: '/dlux-ui/assets/templates/dashboard.html',
                        controller: 'UserDashboardController'
                    }
                }
            });
        }
    ]);
}());
