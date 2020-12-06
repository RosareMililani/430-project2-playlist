const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSongs', mid.requiresLogin, controllers.Song.getSongs);
  app.get('/allSongs', mid.requiresLogin, controllers.Song.getAllSongs);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/myPage', mid.requiresLogin, controllers.Song.myPage);
  app.post('/myPage', mid.requiresLogin, controllers.Song.mySongs);

  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);
  app.post('/settings', mid.requiresLogin, controllers.Account.updatePassword);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/songs', mid.requiresLogin, controllers.Song.songPage);
  app.post('/songs', mid.requiresLogin, controllers.Song.song);

  app.get('/maker', mid.requiresLogin, controllers.Song.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Song.make);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
