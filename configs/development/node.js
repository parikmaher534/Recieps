process.env.PORT = process.env.WEB_PORT || process.env.PORT || 3033;

module.exports = {
    project: {
        name: 'Want to cook'
    },

    mongodb: {
        host: '127.0.0.1',
        dbname: 'WantToCook',
        port: 27100
    },

    web: {
        port: process.env.PORT
    },

    owner : {
        name : 'Nick',
        email : 'parikmaher534@gmail.com'
    },

    smtpOptions : {
        host: 'mail.yandex.ru',
        auth: {
            user: 'mail...',
            pass: 'mail password...'
        }
    }
};