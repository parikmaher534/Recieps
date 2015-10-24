;(function () {

	'use strict';

	angular.module('dlux-ui.controllers', []);

	angular.module('dlux-ui.controllers').controller('AppController', AppController);

	AppController.$inject = ['$scope', '$rootScope', '$state', 'ApiConfig'];

	function AppController($scope, $rootScope, $state, ApiConfig) {
		console.log(ApiConfig);
	};

}());
