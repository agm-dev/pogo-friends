require('../lib/database')
const Group = require('../models/Group')
const config = require('../config/group')

exports.create_group = async data => {
  const group = new Group(data)
  await group.save()
  const group_data = await Group.
    findOne({ _id: group._id }).
    populate('admin')
  return group_data
}

exports.get_group_by_id = async id => {
  const group = await Group.
    findOne({ id }).
    populate('admin').
    populate('members').
    populate('rejected')
  return group
}

exports.get_group_by_chat = async chat_id => {
  const group = await Group.
    findOne({ chat_id }).
    populate('admin').
    populate('members').
    populate('rejected')
  return group
}

exports.get_group_by_admin = async admin_id => {
  const groups = await Group.
    find({ admin: admin_id }).
    populate('admin').
    populate('members').
    populate('rejected')
  return groups
}

exports.update_group = async group => {
  if (!group || typeof group.id !== 'string') {
    console.error('can not update group without group id')
    return {}
  }

  const updated_group = await Group.findOneAndUpdate(
    { id: group.id },
    group,
    { new: true , runValidators: true })
  return updated_group
}

exports.delete_group = async id => {
  const group = await Group.findOneAndRemove({ id: id })
  if (typeof group.id === 'undefined') return null
  return group
}

// TODO
//exports.delete_all_groups = async () => {}

exports.find_groups = async search => {
  if (!search) {
    console.error('required search data to find groups')

  }
  const search_criteria = []
  search_criteria.push({ state: config.open }) // only open groups can be returned
  search_criteria.push({ 'rejected.id': { $ne: search.user_id } }) // user must not be present on rejected users
  search_criteria.push({ 'admin.id': { $ne: search.user_id } }) // user is not the admin of the group
  search_criteria.push({ 'members.id': { $ne: search.user_id } }) // user is not already a member of that group

  const search_frequency = search.frequency || config.min_frequency
  const search_size = search.size || config.default_search_size

  search_criteria.push({ frequency: search_frequency })
  search_criteria.push({ size: search_size })

  const groups = await Group.
    find({ $and: search_criteria }).
    populate('admin').
    populate('members').
    populate('rejected')
  return groups
}

// TODO some privated methods from bot might be moved here if not required in public interface