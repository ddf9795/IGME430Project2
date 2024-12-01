const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const SkellieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  img:
  {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Image',
  },
  bio: {
    type: Map,
    of: String,
    default: new Map(),
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  visibility: {
    type: String,
    required: true,
  },
  permittedUsers: {
    type: [String],
    required: false,
  },
  // comments: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'CommentStore',
  // },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

SkellieSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  img: doc.img,
  bio: doc.bio,
  owner: doc.owner,
  permittedUsers: doc.permittedUsers,
});

const SkellieModel = mongoose.model('Skellie', SkellieSchema);
module.exports = SkellieModel;
