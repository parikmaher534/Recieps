var configs = require(PATHS.APP + '/configs/' + ENV + '/node.js') || {},
    localConfigs = require(PATHS.APP + '/configs/local/node.js') || {},
    extend = require('./addons/deepExtend.js');

module.exports = _.deepExtend(configs, localConfigs);