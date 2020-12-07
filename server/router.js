// will be called to grab certain functions in the folders
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // json
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSongs', mid.requiresLogin, controllers.Song.getSongs);
  app.get('/allSongs', mid.requiresSecure, controllers.Song.getAllSongs);

  // found outside of page
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // found outside of page
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signUpPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // found inside of page
  app.get('/myPage', mid.requiresLogin, controllers.Song.myPage);
  app.post('/myPage', mid.requiresLogin, controllers.Song.mySongs);

  // found inside of page
  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);
  app.post('/settings', mid.requiresLogin, controllers.Account.updatePassword);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // found inside of page
  app.get('/songPage', mid.requiresLogin, controllers.Song.songPage);
  app.post('/songPage', mid.requiresLogin, controllers.Song.allSong);

  // found outside of page
  app.get('/viewSongs', mid.requiresSecure, mid.requiresLogout, controllers.Song.songPageOut);
  app.post('/viewSongs', mid.requiresSecure, mid.requiresLogout, controllers.Song.allSong);

  // found inside of page
  app.get('/maker', mid.requiresLogin, controllers.Song.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Song.make);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
