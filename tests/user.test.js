/**
 * This test file tests user service.
 * User service must be capable to:
 * 1. create a new user in database
 * 2. get user info from database by id
 * 3. update user info into database by id
 * 4. remove user from database by id
 * 5. get users from database by desired_group_size
 * and / or desired_interaction_frequency
 * 6. get users from database by friendly_rating and /
 * or frequency_rating
 */

const User = require('../src/services/user')
const config = require('../src/config/user')
const { initialize_database, finalize_database } = require('./test-utils')
const user_mixture = require('./mixtures/user.mixture')

beforeAll(() => initialize_database())
afterAll(() => finalize_database())

const generic_user_checks = user => {
  expect(user).not.toBe(null)
  expect(user).not.toBe(undefined)
  expect(typeof user.id).toBe('number')
  expect(typeof user.nick).toBe('string')
  expect(typeof user.game_nick).toBe('string')
  expect(typeof user.desired_group_size).toBe('number')
}

// 1.
test('creates a new user in database', async () => {
  const create_user_id = user_mixture.create_user_id
  const user_data = {
    id: create_user_id,
  }
  const user = await User.create_user(user_data)
  generic_user_checks(user)

  expect(user.id).toBe(create_user_id)
  expect(user.desired_group_size).toBe(config.default_desired_group_size)
})

// 2.
test('get user info from database by id', async () => {
  const expected_user = user_mixture.fake_users[1]
  const user = await User.get_user(expected_user.id)
  generic_user_checks(user)
  expect(user.id).toBe(expected_user.id)
  expect(user.nick).toBe(expected_user.nick)
  expect(user.game_nick).toBe(expected_user.game_nick)
})

// 3.
test('update user info into database', async () => {
  const user = user_mixture.update_user
  const updated_user = await User.update_user(user)
  generic_user_checks(updated_user)

  const fields = Object.keys(user)
  fields.map(field => {
    expect(updated_user[field]).toBe(user[field])
  })
})

// 4.
test('remove user from database by id', async () => {
  const id = user_mixture.delete_user_id
  const deleted_user = await User.delete_user(id)
  expect(deleted_user.id).toBe(id)
  const user = await User.get_user(id)
  expect(user).toBe(null)
})

/**
 *
 * 4. remove user from database by id
 * 5. get users from database by desired_group_size
 * and / or desired_interaction_frequency
 * 6. get users from database by friendly_rating and /
 * or frequency_rating
 */