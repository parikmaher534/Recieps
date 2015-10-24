'use strict';

var AuthError = function (message, type) {
  this.message = message;
  this.type = type;
};
AuthError.prototype = Error.prototype;

module.exports = {
  AuthError: AuthError,
  messages: {
    emailTaken: 'This email is already taken',
    invalidPassword: 'Password is invalid',
    notFound: 'User was not found',
    shortPassword: 'Password is too short. 8 characters min'
  }
};
