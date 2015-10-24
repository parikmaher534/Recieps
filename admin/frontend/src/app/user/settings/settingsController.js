;(function () {

    'use strict';

    angular.module('dlux-ui.settings')

    .controller('UserSettingsController', [
        '$scope', '$q', 'CurrentUser', '$http', '$location', 'ApiConfig',

        function($scope, $q, CurrentUser, $http, $location, ApiConfig) {
            var field;

            $q.all([
                CurrentUser.user(true)
            ]).then(function(data) {
                $scope._profile = data[0];
            });

            $scope.change = function(type) {
                field = {};

                if (type == 'password') {
                    field = {
                        name: type,
                        newpass: $scope._profile['newpass'],
                        newpassconfirm: $scope._profile['newpassconfirm']
                    };
                } else {
                    field = {
                        name: type,
                        value: $scope._profile[type]
                    };
                };

                update();
            };

            function update(type) {
                $http({
                    url: ApiConfig.updateUrl,
                    method: 'POST',
                    data: { field: field }
                })
                .then(function(res) {
                    console.log(res, 'response')
                });
            };

            $scope.goToHome = function() {
                $location.path('/');
            };
        }
    ])

}());
