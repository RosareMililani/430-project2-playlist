const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let SongModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

// information to be stored for when creating a new song
const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  artist: {
    type: String,
    trim: true,
    required: true,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    require: true,
  },

  genre: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  user: {
    type: String,
    trim: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// store and send data for use
SongSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  artist: doc.artist,
  rating: doc.rating,
  genre: doc.genre,
  image: doc.image,
  createdDate: doc.createdDate,
  user: doc.user,
});

// find the song information in a particular user
SongSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  // return the following information to be used on the client side
  return SongModel.find(search).select('name artist rating genre image createdDate user').lean().exec(callback);
};

// find all song - by all users
SongSchema.statics.findAll = (callback) => {
  const search = {
  };

  // send only 4 of the information (not all information will be used)
  return SongModel.find(search).select('name artist user image').lean().exec(callback);
};

SongModel = mongoose.model('Song', SongSchema);

// export
module.exports.SongModel = SongModel;
module.exports.SongSchema = SongSchema;
