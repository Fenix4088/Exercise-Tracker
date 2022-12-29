const mongoose = require('mongoose');
const {roundTimestamp} = require("./helpers.js");

const UserScema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  },
  log: [{
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String, default: new Date(Date.now()).toDateString() },
    timestamp: {type: Number, default: roundTimestamp(Date.now())}
  }]
})

module.exports = {
  User: mongoose.model("User", UserScema)
}