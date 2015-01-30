var fs = require('fs');
    pathToPageHTML = 'public/frontend/desktop.bundles/index/index.html',
    errorPageHTML = 'public/frontend/desktop.bundles/index/error.html';

var words = {
    very_bad : 'Всё очень плохо...'
};



/* Тут читаем с файловой системы собранный html основного лайута и отдаем на отрисовку */
function getPageHTML(callback) {
    fs.readFile(pathToPageHTML, callback);
};

/* Если при чтении основного лаяута произошла упячка то отдаем лаяут ошибки */
function getErrorPage(callback) {
    fs.readFile(errorPageHTML, callback);
};


module.exports = {
    init: function(req, res, next) {

        //Рисуем страницу
        getPageHTML(function(err, data) {
            if( !err ) {
                res.send(data.toString('utf-8'));
            } else {

                //Если не смогли отрисовать страницу то рисуем страницу ошибки
                getErrorPage(function(err, data) {
                    if( !err ) {
                        res.send(data.toString('utf-8'));
                    } else {

                        //Если не смогли отрисовать и лаяут ошибки то показываем пИчальку
                        res.send(words.very_bad);
                    }
                });
            }
        });

    }
};