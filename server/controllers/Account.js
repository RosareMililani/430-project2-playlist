// const { request } = require('express');
const models = require('../models');

const { Account } = models;

// render the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// render the signup page
const signUpPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

// render the settings page
const settingsPage = (req, res) => {
  res.render('settings', { csrfToken: req.csrfToken() });
};

// render the settings page
const aboutPage = (req, res) => {
  res.render('about', { csrfToken: req.csrfToken() });
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

  // username or password is not filled out
  if (!username || !password) {
    return res.status(400).json({ error: 'Oops! All fields are required' });
  }

  // check if the correct information matches an account stored
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // on login, attach all fields from toAPI to session
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// create a new account to store data
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // any of the fields are not filled
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Oops! All fields are required' });
  }

  // passwords dont match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Oh no! Passwords do not match' });
  }

  // create the new account and salt the password (security)
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

      // check if the username exists
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

// update an accounts password
const updatePassword = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // not all information is filled out
  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'All fields are required',
    });
  }

  // passwords dont match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match',
    });
  }

  // salt the password (security) with the current user
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
      /* redirect: '/maker', */
      redirect: '/settings',
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

// exports
module.exports.loginPage = loginPage;
module.exports.signUpPage = signUpPage;
module.exports.settingsPage = settingsPage;
module.exports.aboutPage = aboutPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.updatePassword = updatePassword;
