/**
 * This test file tests user service.
 * User service must be capable to:
 * 1. create a new user in database
 * 2. get user info from database by id
 * 3. update user info into database by id
 * 4. remove user from database by id
 * 5. get users from database by desired_group_size
 * and desired_interaction_frequency
 * 6. get users from database by friendly_rating and /
 * or frequency_rating
 */

const User = require('../src/services/user')
const config = require('../src/config/user')
const { initialize_database, finalize_database } = require('./test-utils')
const user_mixture = require('./mixtures/user.mixture')

beforeAll(() => initialize_database())
afterAll(() => finalize_database())

// TODO: put this on utils
const generic_user_checks = user => {
  expect(user).not.toBe(null)
  expect(user).not.toBe(undefined)
  expect(typeof user.id).toBe('number')
  expect(typeof user.nick).toBe('string')
  expect(typeof user.game_nick).toBe('string')
  expect(typeof user.desired_group_size).toBe('number')
}

const is_valid_user = user => typeof user.nick === 'string' && user.nick.length > 0 && typeof user.game_nick === 'string' && user.game_nick.length > 0

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

test('update user only changes sent info', async () => {
  const data = user_mixture.update_user_nick
  const fake_users = user_mixture.fake_users
  const id = data.id
  const nick = data.nick
  const filtered = fake_users.filter(user => user.id === id)
  const expected_user = filtered[0]
  const user = await User.update_user({ id, nick })
  expect(user.nick).toBe(nick)
  expect(user.id).toBe(expected_user.id)
  expect(user.game_nick).toBe(expected_user.game_nick)
})

// 4.
test('remove user from database by id', async () => {
  const id = user_mixture.delete_user_id
  const deleted_user = await User.delete_user(id)
  expect(deleted_user.id).toBe(id)
  const user = await User.get_user(id)
  expect(user).toBe(null)
})

// 5.
test('get users from database by desired_group_size and desired_interaction_frequency', async () => {
  const searchs = user_mixture.desired_searchs
  const fake_users = user_mixture.fake_users

  for (let i=0; i<searchs.length; i++) {
    const size = searchs[i].desired_group_size
    const frequency = searchs[i].desired_interaction_frequency
    const match = await User.find_desired_users(size, frequency)
    const expected = fake_users.filter(user => user.desired_group_size === size && user.desired_interaction_frequency === frequency && is_valid_user(user))

    expect(match.length).toBe(expected.length)

    const expected_ids = expected.map(user => user.id)
    const match_ids = match.map(user => user.id)

    match_ids.map(id => {
      expect(expected_ids).toContain(id)
    })
  }
})

// 6.
test('get users from database by friendly_rating and / or frequency_rating', async () => {
  const searchs = user_mixture.rating_searchs
  const fake_users = user_mixture.fake_users

  for (let i=0; i<searchs.length; i++) {
    const expected = fake_users.filter(user => {
      if (!is_valid_user(user)) return false
      const frequency = searchs[i].frequency_rating || null
      const friendly = searchs[i].friendly_rating || null
      if (frequency !== null && friendly !== null) {
        return user.frequency_rating >= frequency && user.friendly_rating >= friendly
      } else if (frequency !== null) {
        return user.frequency_rating >= frequency
      } else {
        return user.friendly_rating >= friendly
      }
    })

    const match = await User.find_allowed_users(searchs[i])
    expect(match.length).toBe(expected.length)

    const match_ids = match.map(user => user.id)
    const expected_ids = expected.map(user => user.id)

    match_ids.map(id => {
      expect(expected_ids).toContain(id)
    })
  }
})
