module.exports = {
  model_name: 'Group',
  hash_length: 50,
  chat_default_id: -1,
  min_size: 2,
  max_size: 20,
  min_frequency: 1,
  max_frequency: 7,
  allowed: [0, 1, 2, 3],
  allowed_string: ['closed', 'open', 'full', 'validated'],
  0: 'closed',
  1: 'open',
  2: 'full',
  3: 'validated',
  closed: 0,
  open: 1,
  full: 2,
  validated: 3
}