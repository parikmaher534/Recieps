"use strict";

var ENV = process.env.NODE_ENV || 'local',
  forky = require('forky');

switch (ENV) {
  case 'local':
    console.log('Local mode configuration');
  case 'development':
    runSingleThread();
    break;
  case 'production':
    forky({
      path: __dirname + '/server',
      enable_logging: false
    });
    break;
  default:
    console.error('Wrong ENV.');
}

function runSingleThread() {
  require('./server.js');
}
