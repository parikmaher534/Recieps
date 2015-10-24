;(function () {

    'use strict';

    angular.module('dlux-ui.buildSettings', []);

    angular.module('dlux-ui.buildSettings').config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('buildSettings', {
                url: '/build-settings',
                data: {
                    access: 1
                },
                views: {
                    'content@': {
                        templateUrl: '/dlux-ui/assets/templates/buildSettings.html',
                        controller: 'UserBuildSettingsController'
                    }
                }
            });
        }
    ]);

}());
