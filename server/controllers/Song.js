const models = require('../models');

const { Song } = models;

const makerPage = (req, res) => {
  // res.render('app');
  Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), songs: docs });
  });
};

const makeSong = (req, res) => {
  if (!req.body.name || !req.body.artist || !req.body.rating) {
    return res.status(400).json({ error: 'Oops! Name, artist, rating, genre, favorite, playlist are required' });
  }

  const songData = {
    name: req.body.name,
    artist: req.body.artist,
    rating: req.body.rating,
    genre: req.body.genre,
    favorite: req.body.favorite,
    playlist: req.body.playlist,
    owner: req.session.account._id,
  };

  const newSong = new Song.SongModel(songData);

  const songPromise = newSong.save();

  songPromise.then(() => res.json({ redirect: '/maker' }));

  songPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Song already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return songPromise;
};

// get JSON responses of Songs for a user
// allow our client app to update dynamically using React
// app will update without changing pages, dynamically grab updates from the server
//  and immediantly update the UI on screen
const getSongs = (request, response) => {
  const req = request;
  const res = response;

  return Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ songs: docs });
  });
};

const getAllSongs = (request, response) => {
  // const req = request;
  const res = response;

  return Song.SongModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ songs: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getSongs = getSongs;
module.exports.make = makeSong;
module.exports.getAllSongs = getAllSongs;
