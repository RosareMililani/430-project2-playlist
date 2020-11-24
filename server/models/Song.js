const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let SongModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const now = new Date();
const formattedDate = now.toLocaleDateString(
  'en-gb',
  {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'utc',
  },
);
console.log(now);
console.log(formattedDate);

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

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});
console.log(formattedDate);

SongSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  artist: doc.artist,
  rating: doc.rating,
  genre: doc.genre,
  createdDate: doc.createdDate,
});

SongSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return SongModel.find(search).select('name artist rating genre createdDate').lean().exec(callback);
};

SongModel = mongoose.model('Song', SongSchema);

module.exports.SongModel = SongModel;
module.exports.SongSchema = SongSchema;