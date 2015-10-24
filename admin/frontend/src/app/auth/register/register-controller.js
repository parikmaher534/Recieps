;(function () {
    'use strict';

    angular.module('dlux-ui.auth.register').controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$state', 'Auth', 'notify'];

    function RegisterController($scope, $state, Auth, notify) {
        if (Auth.isAuthenticated()) $state.go('user.dashboard');

        $scope.signup = {};

        $scope.signUp = function() {
            Auth.register($scope.signup).then(function(data) {
                if (data && data.status != 200) {
                    notify({
                        message: data.data.message,
                        classes: 'notify-error'
                    });
                } else {
                    $state.go('user');
                };
            });
        };
    }
}());
