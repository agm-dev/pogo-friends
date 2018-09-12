// requires
require('../lib/database')
const User = require('../models/User')

exports.create_user = async user => {
  const new_user = new User(user)
  await new_user.save()
  return new_user
}

exports.get_user = async id => {
  const user = await User.findOne({ id })
  if (user === null || typeof user.id === 'undefined') return null
  return user
}

exports.update_user = async user => {
  if (typeof user.id !== 'number') {
    console.error('must provide user id to update an user')
    return null
  }
  const updated_user = await User.findOneAndUpdate(
    { id: user.id },
    user,
    { new: true , runValidators: true })
  return updated_user
}

exports.delete_user = async id => {
  const user = await User.findOneAndRemove({ id: id })
  if (typeof user.id === 'undefined') return null
  return user
}