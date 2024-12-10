const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commenter: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  poster: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const CommentModel = mongoose.model('Comment', commentSchema);
module.exports = CommentModel;
