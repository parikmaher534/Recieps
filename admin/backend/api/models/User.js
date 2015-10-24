/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    firstName: {
      type: "string",
      required: true
    },
    lastName: {
      type: "string",
      required: true
    },
    email: {
      type: "string",
      required: true,
      index: true,
      unique: true
    },
    isAdmin: {
      type: 'boolean'
    },
    key: {
      type: 'string',
      defaultsTo: 'dluxtestkey123'
    },
    toJson: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;

    },
    toFrontendJson: function() {
      var obj = this.toJson();
      delete obj.transactions;
      delete obj.banks;
      return obj;
    }
  }

};

