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

exports.find_desired_users = async (size, frequency) => {
  const users = await User.find({ $and: [
    { nick: { $gt: 0 } },
    { game_nick: { $gt: 0 } },
    { desired_group_size: size },
    { desired_interaction_frequency: frequency },
  ] })
  return users
}

exports.find_allowed_users = async search => {
  // lets filter the allowed search fields
  const filtered_search = {}
  if (typeof search.frequency_rating === 'number') filtered_search.frequency_rating = search.frequency_rating
  if (typeof search.friendly_rating === 'number') filtered_search.friendly_rating = search.friendly_rating

  // if there is none of the allowed search fields, we cannot search, so return empty
  if (typeof filtered_search.frequency_rating === 'undefined' && typeof filtered_search.friendly_rating === 'undefined') return []

  const search_criteria = [
    { nick: { $gt: 0 } },
    { game_nick: { $gt: 0 } },
  ]
  if (typeof filtered_search.frequency_rating !== 'undefined') search_criteria.push({ frequency_rating: { $gte: filtered_search.frequency_rating } })

  if (typeof filtered_search.friendly_rating !== 'undefined') search_criteria.push({ friendly_rating: { $gte: filtered_search.friendly_rating } })

  const users = await User.find({ $and: search_criteria })
  return users
}
