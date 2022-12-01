const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  movements: {
    type: Array
  }
})

module.exports = mongoose.model('User',userSchema)