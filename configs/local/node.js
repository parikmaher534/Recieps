var port = process.env.WEB_PORT || process.env.PORT || 3000;

module.exports = {
    project: {
        name: 'Want to cook'
    },

    mongodb: {
        host: '127.0.0.1',
        dbname: 'WantToCook',
        port: 27017
    },

    web: {
        port: port
    },

    owner : {
        name : 'Nick',
        email : 'kolya.p@speedandfunction.com'
    },

    smtpOptions : {
        host: 'mail.yandex.ru',
        auth: {
            user: 'mail...',
            pass: 'mail password...'
        }
    }
};