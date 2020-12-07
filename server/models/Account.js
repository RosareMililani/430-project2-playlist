const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// variables
let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

// schema that will create our data
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// same as return way - shorter way, in order to return our values
AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
});

// checks password
const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

// look for username
AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  // look for the one account that is being entered
  return AccountModel.findOne(search, callback);
};

// used for password (security)
AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

// authenticate account by the information the invidual has entered
AccountSchema.statics.authenticate = (username, password, callback) => {
  // look for the username account in data
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    // check password
    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

AccountModel = mongoose.model('Account', AccountSchema);

// export
module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
