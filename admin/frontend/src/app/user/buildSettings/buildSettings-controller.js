;(function () {
    'use strict';

    angular.module('dlux-ui.buildSettings')
      .controller('UserBuildSettingsController', UserBuildSettingsController);

    UserBuildSettingsController.$inject = ['$scope', '$q', '$state', 'Auth', 'CurrentUser', 'HouseData'];

    function UserBuildSettingsController($scope, $q, $state, Auth, CurrentUser, HouseData) {

        $q.all([
            CurrentUser.user(true),
            HouseData.all()
        ]).then(function(data) {
            $scope._loaded = true;
            $scope._profile = data[0];
        });

        $scope.goToHome = function() {
            $state.reload();
        };

        $scope.logout = function() {
            Auth.logout();
        };
    };
}());
