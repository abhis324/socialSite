const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  postDate: {type: Date, default: Date.now},
  userID: {type: String, required: true},
  likes: {type: Number, required: true},
  content: {type: String, required: true}
})

const Post = mongoose.model('post', PostSchema)

module.exports = Post
