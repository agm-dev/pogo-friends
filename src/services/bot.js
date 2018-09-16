/**
 *
 */
const user_service = require('./user')
const config = require('../config/bot')
const user_config = require('../config/user')

class Bot {
  constructor() {

  }

  static async create_user(data) {
    if (typeof data.id !== 'number') return null
    const user = await user_service.create_user(data)
    if (typeof data.id !== 'number') return null
    return user_service.filter_user_info(user)
  }

  static get_required_nick_message() {
    return config.texts.required_nick
  }

  static async set_game_nick(id = null, nick = '') {
    if (id === null || typeof id !== 'number') {
      console.error('valid id required')
      return null
    }

    if (typeof nick !== 'string' || !nick.length) {
      console.error('valid nick required')
      return null
    }

    const user = await user_service.update_user({ id, game_nick: nick })
    if (!user || id !== user.id) {
      console.error('something went wrong')
      return null
    }

    console.log(`updated user ${user.id} with game_nick ${user.game_nick}`)
    return user
  }

  static async set_nick(id = null, nick = '') {
    if (id === null || typeof id !== 'number') {
      console.error('valid id required')
      return null
    }

    if (typeof nick !== 'string' || !nick.length) {
      console.error('valid nick required')
      return null
    }

    const user = await user_service.update_user({ id, nick })
    if (!user || id !== user.id) {
      console.error('something went wrong')
      return null
    }

    console.log(`updated user ${user.id} with nick ${user.game_nick}`)
    return user
  }

  static async set_user_desired_size(id = null, size = null) {
    if (id === null || typeof id !== 'number') {
      console.error('valid id required')
      return null
    }

    if (size === null) size = user_config.default_desired_group_size

    const user = await user_service.update_user({
      id,
      desired_group_size: size
    })

    if (!user || user.id !== id) {
      console.error('something went wrong')
      return null
    }

    console.log(`updated user ${user.id} with desired group size ${user.desired_group_size}`)
    return user
  }

  static async set_user_desired_frequency(id = null, frequency = null) {
    if (id === null || typeof id !== 'number') {
      console.error('valid id required')
      return null
    }

    if (frequency === null) frequency = user_config.default_desired_frequency

    const user = await user_service.update_user({
      id,
      desired_interaction_frequency: frequency
    })

    if (!user || user.id !== id) {
      console.error('something went wrong')
      return null
    }

    console.log(`updated user ${user.id} with desired group frequency ${user.desired_interaction_frequency}`)
    return user
  }

  static is_valid_user(user = null) {
    if (typeof user === 'object') {
      const valid_id = typeof user.id === 'number' && user.id > 0
      const valid_nick = typeof user.nick === 'string' && user.nick.length
      const valid_game_nick = typeof user.game_nick === 'string' && user.game_nick.length
      if (valid_id && valid_nick && valid_game_nick) return true
    }
    return false
  }


  // TODO: mirar un poco cómo hacer el bot telgram, para
  // ver cuáles de estas acciones pueden ser privadas,
  // porque no las require la interfaz pública
  // Las que puedan ser privadas, dejarlas como parte de
  // los servicios, o si requieren de ambos servicios,
  // definirlas fuera de la clase, para que no estén en
  // la interfaz pública

  static async create_group() {}
  static async set_group_size() {}
  static async set_group_frequency() {}

  static async add_user_to_group() {}

  static async is_group_full() {}
  static async get_group_validation_message() {}
  static async get_group_info() {}
  static async is_group_admin() {}
  static async reject_user_from_group() {}
  static async open_group() {}
  static async validate_group() {}
  static async close_group() {}
  static async rate_user_frequency() {}
  static async rate_user_frienly() {}
  static async find_matching_groups() {}


}

module.exports = Bot