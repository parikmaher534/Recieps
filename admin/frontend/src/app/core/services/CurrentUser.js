;(function() {
    'use strict';

    angular.module('dlux-ui.services').factory('CurrentUser', CurrentUser);

    CurrentUser.$inject = [
      '$http', '$q', '$rootScope', 'ApiConfig', 'Storage'
    ];

    function CurrentUser($http, $q, $rootScope, ApiConfig, Storage) {

        function updateInStorage(user) {
            var stored = angular.fromJson(Storage.get('auth_token'));

            if (stored) stored.user = user;

            Storage.set('auth_token', angular.toJson(stored));
        };

        return {
            user: function userFunc(getFromApiFlag, getAllInfo) {
                var user,
                    data = Storage.get('auth_token'),
                    deferred = $q.defer();

                if (!getFromApiFlag) {
                    if (!data) return {};

                    user = angular.fromJson(data).user;
                    user.fullName = [user.firstName, user.lastName].join(' ');

                    deferred.resolve(user);
                } else {
                    $http.get(ApiConfig.meUrl, {params:{all: getAllInfo}})
                        .then(function(response) {
                            deferred.resolve(response.data);
                        })
                        .catch(function(err) {
                            deferred.reject(err);
                        });
                };

                return deferred.promise;
            }
        };
    }
}());
