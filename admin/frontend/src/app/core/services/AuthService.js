(function () {
  'use strict';

  angular.module('dlux-ui.services').factory('Auth', AuthService);

  AuthService.$inject = [
    '$http', '$state', '$q',
    'Storage', 'ApiConfig',
    'CurrentUser', 'AccessLevels'
  ];

  function AuthService($http, $state, $q, Storage, ApiConfig, CurrentUser, AccessLevels) {
    return {

      'authorize'    : function authorize ( accessLevel ) {
        if ( accessLevel === AccessLevels.user ) {
          return this.isAuthenticated ();
        } else if ( accessLevel === AccessLevels.admin ) {
          return this.isAuthenticated () && Boolean ( angular.fromJson ( Storage.get ( 'auth_token' ) ).user.admin );
        } else {
          return accessLevel === AccessLevels.anon;
        }
      },

      'isAuthenticated': function isAuthenticated() {
        return !!Storage.get('auth_token');
      },

      'register': function register(credentials) {
          return $http
              .post(ApiConfig.registerUrl, credentials)
              .then(function (response) {
                  return Storage.set('auth_token', JSON.stringify(response.data));
              })
              .catch(function (err) {
                  return err;
              });
      },

      'login': function login(credentials) {
          return $http
              .post(ApiConfig.loginUrl, credentials)
              .then(function (response) {
                  return Storage.set('auth_token', JSON.stringify(response.data));
              })
              .catch(function(err) {
                  return err;
              });
      },

      'logout': function logout(isDropped) {
        $http.post(ApiConfig.logoutUrl)
          .then(function() {
            Storage.unset('auth_token');
            location = '/';
          });

      }

      //'requestPasswordChange': function requestPasswordChange(email) {
      //  return $http.post(BackendConfig.url + '/forgot-password', {email: email});
      //},
      //
      //'resetPassword': function resetPassword(credentials) {
      //  return $http.post(BackendConfig.url + '/reset-password', credentials);
      //},
      //
      //checkResetCode: function (code) {
      //  return $http.get(BackendConfig.url + '/resetCode?code=' + code);
      //}
    };
  }

}());
