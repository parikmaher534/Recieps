;(function () {

    'use strict';

    angular.module('dlux-ui.settings', []);

    angular.module('dlux-ui.settings').config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('settings', {
                url: '/user/settings',
                data: {
                    access: 1
                },
                views: {
                    'content@': {
                        templateUrl: '/dlux-ui/assets/templates/settings.html',
                        controller: 'UserSettingsController'
                    }
                }
            });
        }
    ]);

}());
