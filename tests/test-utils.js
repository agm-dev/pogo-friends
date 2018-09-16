require('../src/lib/database')
const User = require('../src/models/User')
const user_mixture = require('./mixtures/user.mixture')
const fake_users = user_mixture.fake_users
const Group = require('../src/models/Group')

// FIXME: this promisified stuff is probably not required
const drop_users = () => {
  return new Promise((resolve, reject) => {
    User.deleteMany({}, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

exports.drop_groups = () => {
  return new Promise((resolve, reject) => {
    Group.deleteMany({}, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

const populate_users = () => {
  return new Promise((resolve, reject) => {
    User.create(fake_users, (err, users) => {
      if (err) return reject(err)
      return resolve(users)
    })
  })
}

exports.initialize_database = async () => {
  await drop_users()
  //console.log('removed user collection')
  const users = await populate_users()
  if (users.length === fake_users.length) {
    //console.log(`users collection has been populated with ${users.length} fake users`)
  } else {
    console.error('error on populating users collection')
  }
}

exports.finalize_database = async () => {
  await drop_users()
  //console.log('removed data from database')
}