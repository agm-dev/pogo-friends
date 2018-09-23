/**
 * This test file tests group service.
 * Group service must be capable to:
 * 1. create a new group in database
 * 2. get group info from database, by id
 * 3. update group info into database
 * 4. remove group from database
 * 5. find groups that matches desired settings,
 * like desired size or frequency, or by state
 */

// Requires:
const { drop_groups } = require('./test-utils')
const Group = require('../src/services/group')
const config = require('../src/config/group')
const mixture = require('./mixtures/group.mixture')
const user_model = require('../src/models/User')
const group_model = require('../src/models/Group')
const user_mixture = require('./mixtures/user.mixture')


// Functions:
const generic_checks = data => {
  expect(data).not.toBe(null)
  expect(data).not.toBe(undefined)
  expect(typeof data.id).toBe('string')
  expect(data.id.length).toBe(config.hash_length)
  expect(typeof data.chat_id).toBe('number')
  expect(data.admin).not.toBe(null)
  // TODO: add checks about chat_id
  expect(typeof data.size).toBe('number')
  expect(data.size).toBeGreaterThanOrEqual(config.min_size)
  expect(data.size).toBeLessThanOrEqual(config.max_size)
  expect(typeof data.frequency).toBe('number')
  expect(data.frequency).toBeGreaterThanOrEqual(config.min_frequency)
  expect(data.frequency).toBeLessThanOrEqual(config.max_frequency)
  // TODO: add checks for members and rejected as array types?
  expect(typeof data.state).toBe('number')
  expect(data.state).toBeGreaterThanOrEqual(Math.min(...config.allowed))
  expect(data.state).toBeLessThanOrEqual(Math.max(...config.allowed))
}

const generate_group_data = async () => {
  const data = mixture.test_create_group
  // create the user if not exists, we only need a valid _id
  const user = await user_model.findOneAndUpdate(
    { id: mixture.test_user_id },
    { id: mixture.test_user_id },
    { new: true, upsert: true },
  )
  data.admin = user._id
  return data
}

const generate_random_group_id = () => {
  const length = config.hash_length
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return [...Array(length)].reduce(result => result + chars.split('')[Math.floor(Math.random() * chars.length)], '')
}


// Generic before and after stuff
beforeAll(async () => await drop_groups())


// Tests
test('group service creates group', async () => {
  const data = await generate_group_data()
  const group = await Group.create_group(data)
  generic_checks(group)
  expect(group.id).toBe(data.id)
  expect(group.size).toBe(data.size)
  expect(group.frequency).toBe(data.frequency)
  expect(group.admin.id).toBe(mixture.test_user_id)
})

test('group service gets all info from group by id', async () => {
  const data = await generate_group_data()
  data.id = generate_random_group_id()

  const group = await Group.create_group(data)
  expect(group.id).toBe(data.id)

  const info = await Group.get_group_by_id(data.id)
  generic_checks(info)
  expect(info.id).toBe(data.id)
  expect(info.admin._id).toEqual(group.admin._id)
  // TODO: add tests to check admin, members, and rejected are populated
})

test('group service gets all info from group by chat id', async () => {
  const data = await generate_group_data()
  data.id = generate_random_group_id()
  data.chat_id = mixture.test_group_chat_id

  const group = await Group.create_group(data)
  expect(group.id).toBe(data.id)
  expect(group.chat_id).toBe(mixture.test_group_chat_id)

  const info = await Group.get_group_by_chat(data.chat_id)
  generic_checks(info)
  expect(info.chat_id).toBe(data.chat_id)
  expect(info.admin._id).toEqual(group.admin._id)
  // TODO: add tests to check admin, members, and rejected are populated
})

test('group service gets all info from group by admin', async () => {
  const data = await generate_group_data()
  data.id = generate_random_group_id()

  const group = await Group.create_group(data)
  expect(group.id).toBe(data.id)

  // get all groups from that admin
  const results = await group_model.
    find({ admin: data.admin }).
    populate('admin').
    populate('members').
    populate('rejected')
  const info = await Group.get_group_by_admin(data.admin)
  expect(info.length).toBe(results.length)

  results.map((group, index) => {
    expect(info[index].id).toBe(group.id)
  })
})

test('group service can update group info by id', async () => {
  const group_data = await generate_group_data()
  group_data.id = generate_random_group_id()

  const group = new group_model(group_data)
  await group.save()

  group_data.size = mixture.test_update_size
  group_data.chat_id = mixture.test_update_chat_id
  const updated = await Group.update_group(group_data)
  expect(updated.size).toBe(mixture.test_update_size)
  expect(updated.chat_id).toBe(mixture.test_update_chat_id)
  expect(updated.id).toBe(group_data.id)
  expect(updated.frequency).toBe(group_data.frequency)
})

test('group service can delete group by id', async () => {
  const group_data = await generate_group_data()
  group_data.id = generate_random_group_id()

  const group = new group_model(group_data)
  await group.save()

  const removed = await Group.delete_group(group.id)
  const query = await group_model.findOne({ id: group.id })
  expect(query).toBe(null)
})

test('group service can delete all groups', async () => {

})

test('group service can search groups and get those which matched the criteria', async () => {
})


