const mongoose = require('mongoose')
const group_config = require('../config/group')
const user_config = require('../config/user')

const model_name = group_config.model_name
const valid_states = group_config.allowed
const state_min = Math.min(...valid_states)
const state_max = Math.max(...valid_states)

const schema = new mongoose.Schema({
  id: { // hash to share
    type: String,
    required: true,
    index: true, // optional while unique is true
    unique: true
  },
  chat_id: { // chat id from chat service
    type: Number,
    required: false, // when group is created there is no chat still
    index: true,
    unique: false, // should be unique.. but we need a default value
    default: group_config.chat_default_id,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user_config.model_name,
    required: true,
    index: true,
    unique: false // one user can create multiple groups
  },
  size: {
    type: Number,
    required: true, // don't create the group till we have all required data
    min: group_config.min_size,
    max: group_config.max_size,
  },
  frequency: {
    type: Number,
    required: true,
    min: group_config.min_frequency,
    max: group_config.max_frequency
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: user_config.model_name
  }],
  rejected: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: user_config.model_name
  }],
  state: {
    type: Number,
    required: false,
    min: state_min,
    max: state_max,
    default: group_config.open
  } // open, full, validated, closed
})

module.exports = mongoose.model(model_name, schema)