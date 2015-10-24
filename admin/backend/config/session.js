/**
 * Session Configuration
 * (sails.config.session)
 *
 * Sails session integration leans heavily on the great work already done by
 * Express, but also unifies Socket.io with the Connect session store. It uses
 * Connect's cookie parser to normalize configuration differences between Express
 * and Socket.io and hooks into Sails' middleware interpreter to allow you to access
 * and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.session.html
 */

module.exports.session = {

  cookie: {
    maxAge: 60 * 1000 * 60 * 24 * 7
  },

  secret: '4e8b156asdasdf9b302342fsdfsdfasfa900dbe89febc1e33c4asfsd6b',
  adapter: 'redis',
  host: 'localhost',
  port: 6379,
  ttl: 0,
  db: 0,
  prefix: 'dlux_sess:'

};