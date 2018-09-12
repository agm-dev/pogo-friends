const mongoose = require('mongoose')
const user_config = require('../config/user')

const model_name = 'User'

const rating = new mongoose.Schema({
  value: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

const schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    index: true, // optional while unique is true
    unique: true
  },
  nick: {
    type: String,
    required: false, // first time user might not have a nick, bot will request him to select a nick for chat service
    trim: true,
    default: ''
  },
  game_nick: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  desired_group_size: {
    type: Number,
    required: false,
    min: 2, // you can't make a group of one single person...
    max: 20,
    default: user_config.default_desired_group_size
  },
  desired_interaction_frequency: { // days between interaction
    type: Number,
    required: false,
    min: 1,
    max: 7,
    default: 1
  },
  frequency_rating: {
    type: Number,
    required: false,
    min: 0,
    max: 10,
    default: 5
  },
  frequency_ratings: [rating],
  friendly_rating: {
    type: Number,
    required: false,
    min: 0,
    max: 10,
    default: 5
  },
  friendly_ratings: [rating],
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model(model_name, schema)