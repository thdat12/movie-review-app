const mongoose = require('mongoose')

const requiredString = {
  type: String,
  required: true
}

const UserSchema = new mongoose.Schema({
  googleId: requiredString,
  displayName: requiredString,
  firstName: requiredString,
  lastName: requiredString,
  image: String,
  createdAt: {
    type: Date, 
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)