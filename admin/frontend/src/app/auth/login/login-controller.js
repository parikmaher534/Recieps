;(function () {
    'use strict';

    angular.module('dlux-ui.auth.register').controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state', 'Auth', 'notify'];

    function LoginController($scope, $state, Auth, notify) {
        if (Auth.isAuthenticated()) {
            $state.go('user.dashboard');
        };

        $scope.login = function() {
            Auth.login($scope.loginData).then(function(data) {
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

        $scope.register = function() {
            $state.go('auth.register');
        };
    };
}());
