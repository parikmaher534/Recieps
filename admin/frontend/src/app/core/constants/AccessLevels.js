(function() {
    'use strict';
    angular.module('dlux-ui')
        .constant('AccessLevels', {
            anon: 0,
            user: 1,
            admin: 2
        });
}());
