;(function () {

  'use strict';

  var backendUrl = 'http://localhost:1334';

  angular.module('dlux-ui')
      .constant('ApiConfig', {
          backendUrl: backendUrl,
          meUrl: backendUrl + '/me',
          updateUrl: backendUrl + '/update',
          userUrl: backendUrl + '/user',
          loginUrl: backendUrl + '/login',
          logoutUrl: backendUrl + '/logout',
          registerUrl: backendUrl + '/auth/local/register',

          houseDataUrl: backendUrl + '/structure',
      });

}());
