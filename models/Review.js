const mongoose = require('mongoose')

const requiredString = {
  type: String,
  required: true
}

const ReviewSchema = new mongoose.Schema({
  title: requiredString,
  body: requiredString,
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private']
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date, 
    default: Date.now
  }
})

module.exports = mongoose.model('Review', ReviewSchema)