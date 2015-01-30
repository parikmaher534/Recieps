var mongoConfig, db,

    http = require('http'),
    path = require('path'),
    fs = require('fs'),

    mongoose = require('mongoose'),
    mongooseIncr = require("mongoose-autoincr-base36"),
    timestamps = require('mongoose-timestamp'),

    logger = new (require('caterpillar').Logger)({ level: 7 }),
    loggerFilter = new (require('caterpillar-filter').Filter)(),
    loggerHuman  = new (require('caterpillar-human').Human)(),

    mailer = require('nodemailer'),
    querystring = require('querystring');


/* Глобальные переменые */
ENV_PROD = 'production';
ENV_DEV = 'development';
ENV = process.env.NODE_ENV || ENV_DEV;
_PAGE_PATH = '';
PATHS = {};
PATHS.APP = path.resolve(__dirname);
PATHS.LIBS = PATHS.APP + '/libs';
controllers = {};
models = {};


//Глобальные модули, которые часто используеся по всем проекте
Q = require('q');
_ = require('underscore');
config = require(PATHS.LIBS + '/config');


/**
 *  Единожды считываем все директории верхнего уровня приложения
 *  и запописываем полные пути к ним.
 */
fs.readdirSync(PATHS.APP).forEach(function(fileName) {
    var pathToFile = PATHS.APP + '/' + fileName,
        stat = fs.statSync(pathToFile);

    if (stat.isDirectory()) {
        PATHS[fileName.toUpperCase()] = pathToFile;
    }
});


/* Горорим держать одновременно не более 50 соединений */
http.globalAgent.maxSockets = 50;


/**
 *  Настраиваем логирование системы.
 *  Перехватываем stdout процесса и делаем красоту.
 */
logger.pipe(loggerFilter).pipe(loggerHuman).pipe(process.stdout);
log = logger.log.bind(logger);


/**
 * Соединяемся с базой данных
 * TODO: создавать структуру базы
 */
;(function() {
    var dbConfig = config.mongodb;

    mongoose.connect(dbConfig.host, dbConfig.dbname, dbConfig.port);

    mongooseIncr.loadAutoIncr(mongoose.connection);

    mongoose.connection
        .once('open', function() {
            log('info', 'Mongoose was connected successfully.');

            require('./server.js');
        })
        .once('error', function(err) {
            log('error', 'Mongoose connection error: ', err);

            process.exit();
        });
})();


/**
 * Генерируем карту с ссылками на объекты контроллеров и моделей
 */
;(function() {

    ;(function initControllers() {
        readDir(PATHS.CONTROLLERS, function(pathToFile) {
            controllers[pathToFile.split('/').pop().split('.js').shift()] = require(pathToFile);
        });
    }());

    ;(function initModels() {
        readDir(PATHS.MODELS, function(pathToFile) {
            var model = require(pathToFile);

            models[model.name] = model.model;
        });
    }());

    function readDir(dir, fileHandler, ignoredDirs) {
        var files = fs.readdirSync(dir);

        files.forEach(function(fileName) {
            var pathToFile = dir + '/' + fileName,
                stat = fs.statSync(pathToFile);

            fileHandler(pathToFile);
        });
    };
})();