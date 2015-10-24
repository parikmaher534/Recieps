
var bunyan = require('bunyan');

function reqSerializer(req) {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers
  };
}
function objectSerializer(obj){
  return obj;
}
function errorStack(err){
  if(err instanceof Error && err.stack && err.message){
    return {
      message: err.message,
      stack: err.stack
    };
  }
  return {};
}
module.exports = bunyan.createLogger(
  {
    name: "dlux",
    src: true,
    streams: [
      {
        level : 'info',
        type  : 'rotating-file',
        path  : './logger/info.log',
        period : '1d',
        count : 30
      },
      {
        level : 'error',
        type  : 'rotating-file',
        path  : './logger/error.log',
        period : '1d',
        count : 30
      }
    ],
    serializers: {
      req: reqSerializer,
      obj: objectSerializer,
      stack: errorStack
    }
  }
);
