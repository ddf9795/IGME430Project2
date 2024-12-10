const models = require('../models');

const { Account } = models;

const notFoundPage = (req, res) => res.render('notFound');

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.set({ 'Set-Cookie': 'username=' });
  res.status(200).redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);
    res.set({ 'Set-Cookie': `username=${req.session.account.username}` });
    return res.status(200).json({ redirect: '/skellieList' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    res.set({ 'Set-Cookie': `username=${req.session.account.username}` });
    return res.status(201).json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// eslint-disable-next-line arrow-body-style
const detailsPage = (req, res) => res.render('details');

// This is known to not work, I was not able to fixit in time. Apologies.
const changePassword = async (req, res) => {
  const {
    username,
    currPass,
    pass,
    pass2,
  } = req.body;

  if (!username || !currPass || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'New passwords do not match!' });
  }

  const auth = await Account.authenticate(username, currPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return account._id;
  });

  try {
    const hash = await Account.generateHash(pass);
    console.log(auth);
    const docs = await Account.findByIdAndUpdate(auth, { password: hash });
    await docs.save();
    res.set({ 'Set-Cookie': `username=${req.session.account.username}` });
    return res.status(200).json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  notFoundPage,
  loginPage,
  login,
  logout,
  signup,
  detailsPage,
  changePassword,
};
