var Q = require('q');

module.exports = {

	all: function(req, res) {
        var result = {};

        // TEMP HACK
        //sails.models.buildings.find({key: req.user.key}, function(err, docs) {
        sails.models.buildings.find({key: 'dluxtestkey123'}, function(err, docs) {
            result = docs[0];

            if (!err && docs.length) {
                sails.models.floors.find({buildId: docs[0].id}, function(err, docs) {
                    var defs = [];

                    result.floors = docs;
                    result.floors.forEach(function(floor) {
                        var floorD = Q.defer();
                        defs.push(floorD.promise);

                        // Find floor rooms
                        sails.models.rooms.find({floorId: floor.id}, function(err, roomdocs) {
                            var bulbsdefArr = [];

                            floor.rooms = roomdocs;
                            floor.rooms.forEach(function(room) {
                                var roomD = Q.defer(),
                                    sceneD = Q.defer();

                                bulbsdefArr.push(roomD.promise);
                                bulbsdefArr.push(sceneD.promise);

                                // Find room bulbs
                                sails.models.bulbs.find({roomId: room.id}, function(err, bulbdocs) {
                                    room.devices = bulbdocs;
                                    roomD.resolve();
                                });

                                // Find room scenes
                                sails.models.scenes.find({roomId: room.id}, function(err, scenedocs) {
                                    var scenesDefArr = [];

                                    room.scenes = scenedocs;
                                    room.scenes.forEach(function(state) {
                                        var stateD = Q.defer();
                                        scenesDefArr.push(stateD.promise);

                                        // Find scene items
                                        sails.models.scenestates.find({sceneId: state.id}, function(err, statedocs) {
                                            if (!err) {
                                                state.devices = statedocs;
                                                stateD.resolve();
                                            } else {
                                                stateD.reject('Can\'t get scene items');
                                            };
                                        });
                                    });

                                    Q.allSettled(scenesDefArr).then(function() {
                                        sceneD.resolve();
                                    });
                                });
                            });

                            Q.allSettled(bulbsdefArr).then(function() {
                                floorD.resolve();
                            });
                        });
                    });

                    Q.allSettled(defs).then(function() {
                        return res.json(result);
                    });
                });
            }
        });
	}
};
