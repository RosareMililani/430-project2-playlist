const models = require('../models');

const { Song } = models;

const makerPage = (req, res) => {
  // res.render('app');
  // find the owners song - they have added that is stored
  Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), songs: docs });
  });
};

// finds all the songs any user had added - used inside login
const songPage = (req, res) => {
  Song.SongModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('songPage', { csrfToken: req.csrfToken(), songs: docs });
  });
};

// finds all the songs any user had added - used outside login
// same code as above, but needs to be redirected on different pages
const songPageOut = (req, res) => {
  Song.SongModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('songPageOut', { csrfToken: req.csrfToken(), songs: docs });
  });
};

// finds all of the users songs they have added
// load onto 'my songs'
const myPage = (req, res) => {
  Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('myPage', { csrfToken: req.csrfToken(), songs: docs });
  });
};

// used on the create page, stores data for calling use
const makeSong = (req, res) => {
  // makes sure all information is filled out
  if (!req.body.name || !req.body.artist || !req.body.rating
    || !req.body.genre || !req.body.image) {
    return res.status(400).json({ error: 'Oops! All fields are required' });
  }

  // song information
  const songData = {
    name: req.body.name,
    artist: req.body.artist,
    rating: req.body.rating,
    genre: req.body.genre,
    image: req.body.image,
    owner: req.session.account._id,
    user: req.session.account.username,
  };

  const newSong = new Song.SongModel(songData);

  const songPromise = newSong.save();

  songPromise.then(() => res.json({ redirect: '/maker' }));

  songPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      // checks if the songs already exists in account
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

// grabs all songs that are added by any user
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

// exports
module.exports.makerPage = makerPage;
module.exports.songPage = songPage;
module.exports.songPageOut = songPageOut;
module.exports.myPage = myPage;
module.exports.getSongs = getSongs;
module.exports.getAllSongs = getAllSongs;
module.exports.make = makeSong;
module.exports.mySongs = makeSong;
module.exports.song = makeSong;
module.exports.allSong = makeSong;
