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

exports.delete_all_groups = async () => {}

exports.find_groups = search => {}

// TODO some privated methods from bot might be moved here if not required in public interface