/**
 * This test file tests bot
 *
 * Bot should be main entry point of
 * application: the interface of this app
 *
 */

const bot = require('../src/services/bot')
const mixture = require('./mixtures/bot.mixture')

// TODO: put this on utils
const generic_user_checks = user => {
  expect(user).not.toBe(null)
  expect(user).not.toBe(undefined)
  expect(typeof user.id).toBe('number')
  expect(typeof user.nick).toBe('string')
  expect(typeof user.game_nick).toBe('string')
  expect(typeof user.desired_group_size).toBe('number')
}

test('bot creates new user with validated received info', async () => {
  const user = await bot.create_user(mixture.create_user_info_ok)
  generic_user_checks(user)
  expect(user.id).toBe(mixture.create_user_info_ok.id)
})

test('bot returns null on create user if not enough info', async () => {
  const user = await bot.create_user(mixture.create_user_info_ko)
  expect(user).toBe(null)
})

test('bot sets game nick', async () => {
  const user = await bot.create_user(mixture.update_game_nick_user)
  const updated = await bot.set_game_nick(user.id, mixture.update_game_nick)
  expect(updated.id).toBe(user.id)
  expect(updated.id).toBe(mixture.update_game_nick_user.id)
  expect(updated.game_nick).toBe(mixture.update_game_nick)
  expect(updated.nick).toBe(mixture.update_game_nick_user.nick)
})

test('bot sets nick', async () => {
  const user = await bot.create_user(mixture.update_nick_user)
  const updated = await bot.set_nick(user.id, mixture.update_nick)
  expect(updated.id).toBe(user.id)
  expect(updated.id).toBe(mixture.update_nick_user.id)
  expect(updated.game_nick).toBe(mixture.update_nick_user.game_nick)
  expect(updated.nick).toBe(mixture.update_nick)
})