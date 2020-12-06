// const { request } = require('express');
const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const signUpPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

const settingsPage = (req, res) => {
  res.render('settings', { csrfToken: req.csrfToken() });
};

// remove a user session - on logout
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings t cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Oops! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // on login, attach all fields from toAPI to session
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.profileName = `${req.body.profileName}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.profileName || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Oops! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Oh no! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      // duplicate the account data in the session
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const updatePassword = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // need to enter twice
  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'All fields are required',
    });
  }

  // if passwords dont match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match',
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    Account.AccountModel.updateOne({ _id: req.session.account._id }, {
      username: req.session.account.username,
      salt,
      password: hash,
    }, (err) => {
      if (err) {
        return res.status(400).json({
          error: 'An error occured',
        });
      }
      return res.status(200);
    });
    res.json({
      redirect: '/maker',
    });
  });
};

// allows our react app to get a one-time token each time
//  it needs to send a form (signup or login).
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.signUpPage = signUpPage;
module.exports.settingsPage = settingsPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.updatePassword = updatePassword;
