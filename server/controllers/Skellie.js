const fs = require('fs');
const path = require('path');

const models = require('../models');

const {
  Skellie, Image, Account, Comment,
} = models;

// eslint-disable-next-line arrow-body-style
const makerPage = async (req, res) => {
  const username = req.headers.cookie.split('=')[2];
  return res.render('maker', { username });
};

const skelliePage = async (req, res) => {
  const username = req.headers.cookie.split('=')[2];
  return res.render('skellie', { username });
};

const skellieListPage = async (req, res) => {
  const username = req.headers.cookie.split('=')[2];
  return res.render('skellielist', { username });
};

const searchPage = async (req, res) => {
  const username = req.headers.cookie.split('=')[2];
  return res.render('search', { username });
};

const makeSkellie = async (req, res) => {
  const body = JSON.stringify(req.body);
  console.log(body);
  // if (!body.name) {
  //   return res.status(400).json({ error: 'All fields are required!' });
  // }
  const obj = {
    data: fs.readFileSync(path.join('./server/', `${req.file.filename}`)),
    contentType: 'image/png',
  };
  const newImg = await Image.create(obj);
  console.log(newImg._id);
  fs.unlinkSync(path.join('./server/', `${req.file.filename}`));

  const skellieData = {
    name: req.body.name,
    img: newImg._id,
    bio: req.body.bio,
    owner: req.session.account._id,
    visibility: req.body.vis,
    permittedUsers: req.body.permittedUsers,
    comments: req.body.comments,
  };

  try {
    const newSkellie = new Skellie(skellieData);
    await newSkellie.save();

    const owner = await Account.findById(newSkellie.owner._id);
    await owner.skellies.push(newSkellie._id);
    await owner.save();

    return res.redirect(`/skellie?${new URLSearchParams({ id: newSkellie._id })}`);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Skellie already exists!' });
    }
    return res.status(500).json({ error: 'An error coccured making skellie!' });
  }
};

const getPersonalSkellies = async (req, res) => {
  try {
    const username = req.headers.cookie.split('=')[2];
    const query1 = { owner: req.session.account._id };
    const query3 = { permittedUsers: username };
    const regex = new RegExp(`^$|${req.query.name}`, 'i');
    const docs = await Skellie.find({ name: { $regex: regex } }).or(query1).or(query3)
      .select('name img bio owner visibility permittedUsers comments')
      .populate('img')
      .populate('owner')
      .lean()
      .exec();
    return res.json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving skellies!' });
  }
};

const getSkellies = async (req, res) => {
  try {
    const username = req.headers.cookie.split('=')[2];
    const query1 = { owner: req.session.account._id };
    const query2 = { visibility: 'public' };
    const query3 = { permittedUsers: username };
    const regex = new RegExp(`^$|${req.query.name}`, 'i');
    const docs = await Skellie.find({ name: { $regex: regex } }).or(query2).or(query1).or(query3)
      .select('name img bio owner visibility permittedUsers')
      .populate('img')
      .populate('owner')
      .lean()
      .exec();
    return res.status(201).json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving skellies!' });
  }
};

const searchPersonalSkellies = async (req, res) => {
  try {
    const username = req.headers.cookie.split('=')[2];
    const query1 = { owner: req.session.account._id };
    const query3 = { permittedUsers: username };
    const regex = new RegExp(req.query.name, 'i');
    const docs = await Skellie.find({ name: { $regex: regex } }).or(query1).or(query3)
      .select('name img bio owner visibility permittedUsers')
      .populate('img')
      .populate('owner')
      .lean()
      .exec();
    return res.status(201).json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving skellies!' });
  }
};

const searchSkellies = async (req, res) => {
  try {
    const username = req.headers.cookie.split('=')[2];
    const query3 = { permittedUsers: username };
    const query4 = { visibility: 'public' };
    const regex = new RegExp(req.query.name, 'i');
    const docs = await Skellie.find({ name: { $regex: regex } }).or(query3).or(query4)
      .select('name img bio owner visibility permittedUsers')
      .populate('img')
      .populate('owner')
      .lean()
      .exec();
    return res.json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving skellies!' });
  }
};

const getSkellie = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    const query = { _id: id };
    const docs = await Skellie.find(query)
      .select('name img bio owner visibility permittedUsers comments')
      .populate('img')
      .populate('owner')
      .populate('comments')
      .lean()
      .exec();
    return res.json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving skellies!' });
  }
};

const addBio = async (req, res) => {
  try {
    const { id, topic, desc } = req.body;
    const query = { _id: id };
    const docs = await Skellie.findById(query);
    await docs.bio.set(topic, desc);
    await docs.save();
    return res.status(201).json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error adding to bio!' });
  }
};

const addUser = async (req, res) => {
  try {
    const { id, user } = req.body;
    const query = { _id: id };
    const docs = await Skellie.findById(query);
    await docs.permittedUsers.push(user);
    await docs.save();
    return res.status(201).json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error adding to whitelist!' });
  }
};

const addComment = async (req, res) => {
  try {
    const {
      id,
      poster,
      comment,
    } = req.body;
    console.log(req.session.account._id);
    const query = { _id: id };
    const docs = await Skellie.findById(query);
    const newComment = new Comment({
      commenter: req.session.account._id,
      poster,
      content: comment,
    });
    await docs.comments.push(newComment);
    await docs.save();
    return res.status(201).json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error posting comment!' });
  }
};

const deleteSkellie = async (req, res) => {
  try {
    const { id } = req.body;
    const query = { _id: id };
    const docs = await Skellie.findById(query);

    const owner = await Account.findById(docs.owner._id).populate('skellies');
    for (let i = 0; i < owner.skellies.length; i++) {
      const skellie = owner.skellies[i];
      console.log(skellie._id);
      if (skellie._id.toString() === id) {
        owner.skellies.splice(i, 1);
        break;
      }
    }
    await owner.save();

    await Image.findByIdAndDelete(docs.img._id);

    await Skellie.findByIdAndDelete(query);

    return res.status(200).json({ redirect: '/skellieList' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting skellie!' });
  }
};

const deleteBio = async (req, res) => {
  try {
    const { id, name } = req.body;
    const query = { _id: id };
    const docs = await Skellie.findById(query);
    const success = await docs.bio.delete(name);
    console.log(success);
    await docs.save();
    return res.status(200).json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting bio point!' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id, index } = req.body;
    const query = { _id: id };
    const docs = await Skellie.findById(query);
    const success = await docs.permittedUsers.splice(index, 1);
    console.log(success);
    await docs.save();
    return res.status(200).json({ skellies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting from whitelist!' });
  }
};

module.exports = {
  makerPage,
  skelliePage,
  skellieListPage,
  searchPage,
  makeSkellie,
  getSkellies,
  getPersonalSkellies,
  getSkellie,
  searchPersonalSkellies,
  searchSkellies,
  addBio,
  addUser,
  addComment,
  deleteSkellie,
  deleteBio,
  deleteUser,
};
