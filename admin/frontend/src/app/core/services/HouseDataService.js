;(function() {
    'use strict';

    angular.module('dlux-ui.services').factory('HouseData', HouseData);

    HouseData.$inject = [
      '$http', '$q', '$rootScope', 'ApiConfig', 'Storage'
    ];

    function HouseData($http, $q, $rootScope, ApiConfig, Storage) {
        return {
            all: function userFunc() {
                var data = Storage.get('auth_token'),
                    deferred = $q.defer();

                $http.get(ApiConfig.houseDataUrl, {})
                    .then(function(response) {
                        $rootScope.house = response.data;
                        deferred.resolve();
                    })
                    .catch(function(err) {
                        deferred.reject(err);
                    });

                return deferred.promise;
            }
        };
    }
}());
