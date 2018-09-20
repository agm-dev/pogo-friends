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

exports.get_group_by_admin = async id => {}

exports.update_group = async group => {}

exports.delete_group = async id => {}

exports.find_groups = search => {}

// TODO some privated methods from bot might be moved here if not required in public interface