const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FriendSchema = new Schema({
  id: {type:String}
})

const UserSchema = new Schema({
  friends: [FriendSchema],
  receivedFriendRequests: [FriendSchema],
  sentFriendRequests: [FriendSchema],
  name: {type: String},
  place: {type: String},
  password: {type: String}
})

const User = mongoose.model('user', UserSchema)

module.exports = User
