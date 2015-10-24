'use strict';

/**
 * Passport configuration
 *
 * This if the configuration for your Passport.js setup and it where you'd
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */
module.exports.passport = {
  local : {
    strategy : require ( 'passport-local' ).Strategy
  }

  //facebook : {
  //  name     : 'Facebook',
  //  protocol : 'oauth2',
  //  strategy : require ( 'passport-facebook' ).Strategy,
  //  options  : {
  //    clientID     : '377758968931148',
  //    clientSecret : '4014a609e0c0439c213af9e605d6a48a'
  //  }
  //},
  //
  //google : {
  //  name     : 'Google',
  //  protocol : 'oauth2',
  //  strategy : require ( 'passport-google-oauth' ).OAuth2Strategy,
  //  options  : {
  //    scope        : ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  //    clientID     : '240571040192-qjsm2d0st2af40722ba37p5ogu7gv56f.apps.googleusercontent.com',
  //    clientSecret : 'uJj-F68QMCL3hN9EMMZkrJ7R'
  //  }
  //}
};
