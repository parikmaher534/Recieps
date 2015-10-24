;(function () {

    'use strict';

    angular.module('dlux-ui.ingredients', [])

    .controller('IngredientsCtrl', [
        '$scope',

        function($scope) {
            //TODO: ...
        }
    ])

    .directive('myIngredients', function() {
        return ({
            replace: true,
            templateUrl: '/dlux-ui/assets/templates/ingredients.html'
        });
    })

}());
