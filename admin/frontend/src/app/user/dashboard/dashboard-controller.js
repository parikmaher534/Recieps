;(function () {
    'use strict';

    angular.module('dlux-ui.user.dashboard')
      .controller('UserDashboardController', UserDashboardController);

    UserDashboardController.$inject = ['$scope', '$q', '$state', 'Auth', 'CurrentUser', 'HouseData'];

    function UserDashboardController($scope, $q, $state, Auth, CurrentUser, HouseData) {
        $q.all([
            CurrentUser.user(true),
            HouseData.all()
        ]).then(function(data) {
            $scope._loaded = true;
            $scope._profile = data[0];

            $scope.$root.scenes = [];

            $scope.$root.house.light = 0;
            $scope.$root.house.color = 0;

            // Init sliders in the next tick
            setTimeout(function() {
                sliderInit($(
                    '.dashboard-slider__light,' +
                    '.dashboard-slider__color'
                ));

                sliderInit($('.dashboard-slider__top-level-light')).on('slide', function() {
                    var light = +$(this).val();
                    updateAllModel(light, 'light');
                    $('.dashboard-slider__light').slider('setValue', light);
                });

                sliderInit($('.dashboard-slider__top-level-color')).on('slide', function() {
                    var color = +$(this).val();
                    updateAllModel(color, 'color');
                    $('.dashboard-slider__color').slider('setValue', color);
                });
            }, 0);
        });

        function updateAllModel(val, type) {
            $scope.$root.house.floors.forEach(function(floor) {
                var floortype = (type == 'light') ? 'floorDim' : 'floorCt';
                floor[floortype] = val;

                floor.rooms.forEach(function(room) {
                    var roomtype = (type == 'light') ? 'roomDim' : 'roomCt';
                    room[roomtype] = val;

                    room.devices.forEach(function(device) {
                        var devicetype = (type == 'light') ? 'lightDim' : 'lightCt';
                        device[devicetype] = val;
                    });
                });
            });

            $scope.$apply();
        };

        function sliderInit(sliders) {
            sliders.slider();
            sliderUpdate(sliders);

            return sliders;
        };

        function sliderUpdate(sliders) {
            sliders.on('slide', function(e, data) {
                $(this).closest('.dashboard__item-wrapper')
                       .find('.dashboard__item-light-val').text(e.value);
            });
        };

        $scope.goToHome = function() {
            $state.reload();
        };

        $scope.logout = function() {
            Auth.logout();
        };
    };
}());

