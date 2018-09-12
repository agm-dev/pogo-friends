/**
 *
 */
const user_service = require('./user')
const config = require('../config/bot')

class Bot {
  constructor() {

  }

  async create_user(data) {
    if (typeof data.id !== 'number') return null
    const user = await user_service.create_user(data)
    if (typeof data.id !== 'number') return null
    return user_service.filter_user_info(user)
  }

  get_required_nick_message() {
    return config.texts.required_nick
  }

  async set_game_nick(id = null, nick = '') {
    if (id === null || typeof id !== 'number') {
      console.error('valid id required')
      return null
    }

    if (typeof nick !== 'string' || !nick.length) {
      console.error('valid nick required')
      return null
    }

    const user = await user_service.update_user({ id, game_nick: nick })
    if (id !== user.id) {
      console.error('something went wrong')
      return null
    }

    console.log(`updated user ${user.id} with game_nick ${user.game_nick}`)
    return user
  }

  async set_nick(id = null, nick = '') {
    if (id === null || typeof id !== 'number') {
      console.error('valid id required')
      return null
    }

    if (typeof nick !== 'string' || !nick.length) {
      console.error('valid nick required')
      return null
    }

    const user = await user_service.update_user({ id, nick })
    if (id !== user.id) {
      console.error('something went wrong')
      return null
    }

    console.log(`updated user ${user.id} with nick ${user.game_nick}`)
    return user
  }




  async set_user_desired_size() {}
  async set_user_desired_frequency() {}
  async is_valid_user() {}


  // TODO: mirar un poco cómo hacer el bot telgram, para
  // ver cuáles de estas acciones pueden ser privadas,
  // porque no las require la interfaz pública
  // Las que puedan ser privadas, dejarlas como parte de
  // los servicios, o si requieren de ambos servicios,
  // definirlas fuera de la clase, para que no estén en
  // la interfaz pública

  async create_group() {}
  async set_group_size() {}
  async set_group_frequency() {}
  async add_user_to_group() {}
  async is_group_full() {}
  async get_group_validation_message() {}
  async get_group_info() {}
  async is_group_admin() {}
  async reject_user_from_group() {}
  async open_group() {}
  async validate_group() {}
  async close_group() {}
  async rate_user_frequency() {}
  async rate_user_frienly() {}
  async find_matching_groups() {}


}

module.exports = new Bot()